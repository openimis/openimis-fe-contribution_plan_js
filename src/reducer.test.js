import { describe, expect, it, vi } from "vitest";

// fe-core's barrel imports itself, so the real helpers come from their defining modules.
vi.mock("@openimis/fe-core", async () => vi.importActual("@openimis/fe-core/helpers/api"));

const { default: reducer } = await import("./reducer");
const { graphqlErrors, relayPage, serverError } = await import("@openimis/fe-core/testing");

const initial = () => reducer(undefined, { type: "@@INIT" });
const dispatch = (state, type, { payload, meta } = {}) => reducer(state, { type, payload, meta });
const respond = (state, prefix, data, extra = {}) => dispatch(state, `${prefix}_RESP`, { payload: { data, ...extra } });
const fail = (state, prefix, payload = serverError(500, "Internal Server Error", "boom")) =>
  dispatch(state, `${prefix}_ERR`, { payload });

const SERVER_ERROR = { code: 500, message: "Internal Server Error", detail: "boom" };
// The backend wraps a json.dumps() result in a graphene JSONString, so benefitPlan arrives encoded twice.
const doublyEncoded = (value) => JSON.stringify(JSON.stringify(value));
const BENEFIT_PLAN = { id: "bp-1", code: "BP1", name: "Cash" };

describe("contribution plan reducer", () => {
  describe("initialisation", () => {
    it("starts with nothing loaded and nothing in flight", () => {
      const state = initial();

      expect(state.contributionPlans).toEqual([]);
      expect(state.contributionPlanBundles).toEqual([]);
      expect(state.contributionPlanBundleContributionPlans).toEqual([]);
      expect(state.paymentPlans).toEqual([]);
      expect(state.contributionPlan).toEqual({});
      expect(state.contributionPlanBundle).toEqual({});
      expect(state.paymentPlan).toEqual({});
      expect(state.fetchingContributionPlans).toBe(false);
      expect(state.fetchingPaymentPlans).toBe(false);
    });

    it("returns the same state object for an unrelated action", () => {
      const state = initial();

      expect(reducer(state, { type: "SOMETHING_ELSE" })).toBe(state);
    });
  });

  describe("searches", () => {
    const SEARCHES = [
      ["contribution plans", "CONTRIBUTIONPLAN_CONTRIBUTIONPLANS", "contributionPlan", "ContributionPlans",
        (n) => ({ id: `cp-${n}`, code: `CP${n}`, benefitPlan: doublyEncoded(BENEFIT_PLAN) }),
        (n) => ({ id: `cp-${n}`, code: `CP${n}`, benefitPlan: BENEFIT_PLAN })],
      ["contribution plan bundles", "CONTRIBUTIONPLAN_CONTRIBUTIONPLANBUNDLES", "contributionPlanBundle",
        "ContributionPlanBundles",
        (n) => ({ id: `cpb-${n}`, code: `CPB${n}` }),
        (n) => ({ id: `cpb-${n}`, code: `CPB${n}` })],
      ["bundle contribution plans", "CONTRIBUTIONPLAN_CONTRIBUTIONPLANBUNDLEDETAILS",
        "contributionPlanBundleDetails", "ContributionPlanBundleContributionPlans",
        (n) => ({ id: `d-${n}`, contributionPlan: { id: `cp-${n}`, benefitPlan: doublyEncoded(BENEFIT_PLAN) } }),
        (n) => ({ id: `d-${n}`, contributionPlan: { id: `cp-${n}`, benefitPlan: BENEFIT_PLAN } })],
      ["payment plans", "CONTRIBUTIONPLAN_PAYMENTPLANS", "paymentPlan", "PaymentPlans",
        (n) => ({ id: `pp-${n}`, code: `PP${n}`, benefitPlan: doublyEncoded(BENEFIT_PLAN) }),
        (n) => ({ id: `pp-${n}`, code: `PP${n}`, benefitPlan: BENEFIT_PLAN })],
    ];
    const list = (suffix) => suffix.charAt(0).toLowerCase() + suffix.slice(1);

    it.each(SEARCHES)("empties the %s list and clears the error when a search starts", (
      _label,
      prefix,
      _entity,
      suffix,
    ) => {
      const stale = {
        ...initial(),
        [list(suffix)]: [{ id: "stale" }],
        [`${list(suffix)}TotalCount`]: 3,
        [`${list(suffix)}PageInfo`]: { hasNextPage: true },
        [`error${suffix}`]: SERVER_ERROR,
      };
      const state = dispatch(stale, `${prefix}_REQ`);

      expect(state).toMatchObject({
        [`fetching${suffix}`]: true,
        [`fetched${suffix}`]: false,
        [list(suffix)]: [],
        [`${list(suffix)}TotalCount`]: 0,
        [`${list(suffix)}PageInfo`]: {},
        [`error${suffix}`]: null,
      });
    });

    it.each(SEARCHES)("stores the %s page with its count and cursors", (
      _label,
      prefix,
      entity,
      suffix,
      node,
      parsed,
    ) => {
      const requested = dispatch(initial(), `${prefix}_REQ`);
      const state = respond(requested, prefix, {
        [entity]: relayPage([node(1), node(2)], { totalCount: 7, pageInfo: { hasNextPage: true } }),
      });

      expect(state[list(suffix)]).toEqual([parsed(1), parsed(2)]);
      expect(state[`${list(suffix)}TotalCount`]).toBe(7);
      expect(state[`${list(suffix)}PageInfo`]).toMatchObject({ totalCount: 7, hasNextPage: true });
      expect(state[`fetching${suffix}`]).toBe(false);
      expect(state[`fetched${suffix}`]).toBe(true);
      expect(state[`error${suffix}`]).toBeNull();
    });

    it.each(SEARCHES)("reports an empty %s page rather than throwing", (_label, prefix, entity, suffix) => {
      const state = respond(initial(), prefix, { [entity]: null });

      expect(state[list(suffix)]).toEqual([]);
      expect(state[`${list(suffix)}TotalCount`]).toBeNull();
      expect(state[`${list(suffix)}PageInfo`]).toEqual({});
    });

    it.each(SEARCHES)("surfaces a data error from the %s search", (_label, prefix, entity, suffix) => {
      const state = respond(initial(), prefix, { [entity]: relayPage([]) }, graphqlErrors("bad filter"));

      expect(state[`error${suffix}`]).toMatchObject({ code: "Data error", detail: "bad filter" });
    });

    it.each(SEARCHES)("stops fetching and formats a transport failure of the %s search", (
      _label,
      prefix,
      _entity,
      suffix,
    ) => {
      const state = fail(dispatch(initial(), `${prefix}_REQ`), prefix);

      expect(state[`fetching${suffix}`]).toBe(false);
      expect(state[`error${suffix}`]).toEqual(SERVER_ERROR);
    });

    it("leaves a payment plan without a benefit plan as null", () => {
      const state = respond(initial(), "CONTRIBUTIONPLAN_PAYMENTPLANS", {
        paymentPlan: relayPage([{ id: "pp-1", benefitPlan: null }, { id: "pp-2", benefitPlan: "" }]),
      });

      expect(state.paymentPlans.map((plan) => plan.benefitPlan)).toEqual([null, null]);
    });

    it("empties the bundle contribution plans on clear without starting a fetch", () => {
      const loaded = respond(initial(), "CONTRIBUTIONPLAN_CONTRIBUTIONPLANBUNDLEDETAILS", {
        contributionPlanBundleDetails: relayPage([SEARCHES[2][4](1)]),
      });
      const state = dispatch(loaded, "CONTRIBUTIONPLAN_CONTRIBUTIONPLANBUNDLEDETAILS_CLEAR");

      expect(state).toMatchObject({
        fetchingContributionPlanBundleContributionPlans: false,
        fetchedContributionPlanBundleContributionPlans: false,
        contributionPlanBundleContributionPlans: [],
        contributionPlanBundleContributionPlansPageInfo: {},
        contributionPlanBundleContributionPlansTotalCount: 0,
        errorContributionPlanBundleContributionPlans: null,
      });
    });
  });

  describe("pickers", () => {
    const PICKERS = [
      ["contribution plan", "CONTRIBUTIONPLAN_PICKERCONTRIBUTIONPLANS", "contributionPlan", "PickerContributionPlans"],
      ["payment plan", "CONTRIBUTIONPLAN_PICKERPAYMENTPLANS", "paymentPlan", "PickerPaymentPlans"],
    ];
    const list = (suffix) => `picker${suffix.slice("Picker".length)}`;

    it.each(PICKERS)("empties the %s options when a lookup starts", (_label, prefix, _entity, suffix) => {
      const stale = { ...initial(), [list(suffix)]: [{ id: "stale" }], [`error${suffix}`]: SERVER_ERROR };

      expect(dispatch(stale, `${prefix}_REQ`)).toMatchObject({
        [`fetching${suffix}`]: true,
        [`fetched${suffix}`]: false,
        [list(suffix)]: [],
        [`error${suffix}`]: null,
      });
    });

    it.each(PICKERS)("stores the %s options as they came", (_label, prefix, entity, suffix) => {
      const rows = [{ id: "a", code: "A", name: "Alpha" }, { id: "b", code: "B", name: "Beta" }];
      const state = respond(dispatch(initial(), `${prefix}_REQ`), prefix, { [entity]: relayPage(rows) });

      expect(state[list(suffix)]).toEqual(rows);
      expect(state[`fetching${suffix}`]).toBe(false);
      expect(state[`fetched${suffix}`]).toBe(true);
    });

    it.each(PICKERS)("surfaces a data error from the %s lookup", (_label, prefix, entity, suffix) => {
      const state = respond(initial(), prefix, { [entity]: null }, graphqlErrors("denied"));

      expect(state[list(suffix)]).toEqual([]);
      expect(state[`error${suffix}`]).toMatchObject({ detail: "denied" });
    });

    it.each(PICKERS)("formats a transport failure of the %s lookup", (_label, prefix, _entity, suffix) => {
      const state = fail(dispatch(initial(), `${prefix}_REQ`), prefix);

      expect(state[`fetching${suffix}`]).toBe(false);
      expect(state[`error${suffix}`]).toEqual(SERVER_ERROR);
    });
  });

  describe("single records", () => {
    const RECORDS = [
      ["contribution plan", "CONTRIBUTIONPLAN_CONTRIBUTIONPLAN", "contributionPlan", "ContributionPlan"],
      ["contribution plan bundle", "CONTRIBUTIONPLAN_CONTRIBUTIONPLANBUNDLE", "contributionPlanBundle",
        "ContributionPlanBundle"],
      ["payment plan", "CONTRIBUTIONPLAN_PAYMENTPLAN", "paymentPlan", "PaymentPlan"],
    ];
    const field = (suffix) => suffix.charAt(0).toLowerCase() + suffix.slice(1);

    it.each(RECORDS)("marks the %s in flight and drops the previous one when a load starts", (
      _label,
      prefix,
      _entity,
      suffix,
    ) => {
      const loaded = { ...initial(), [field(suffix)]: { id: "old" }, [`fetched${suffix}`]: true };
      const state = dispatch(loaded, `${prefix}_REQ`);

      expect(state[`fetching${suffix}`]).toBe(true);
      expect(state[`fetched${suffix}`]).toBe(false);
      expect(state[field(suffix)]).not.toEqual({ id: "old" });
      expect(state[`error${suffix}`]).toBeNull();
    });

    it.each(RECORDS)("keeps the first %s of the page", (_label, prefix, entity, suffix) => {
      const state = respond(initial(), prefix, {
        [entity]: relayPage([{ id: "first", code: "A", benefitPlan: doublyEncoded(BENEFIT_PLAN) },
          { id: "second", code: "B", benefitPlan: doublyEncoded(BENEFIT_PLAN) }]),
      });

      expect(state[field(suffix)]).toMatchObject({ id: "first", code: "A" });
      expect(state[`fetching${suffix}`]).toBe(false);
      expect(state[`fetched${suffix}`]).toBe(true);
    });

    it.each(RECORDS)("holds nothing when the %s is not found", (_label, prefix, entity, suffix) => {
      expect(respond(initial(), prefix, { [entity]: relayPage([]) })[field(suffix)]).toBeUndefined();
    });

    it.each(RECORDS)("surfaces a data error from loading the %s", (_label, prefix, entity, suffix) => {
      const state = respond(initial(), prefix, { [entity]: relayPage([]) }, graphqlErrors("gone"));

      expect(state[`error${suffix}`]).toMatchObject({ detail: "gone" });
    });

    it.each(RECORDS)("formats a transport failure of loading the %s", (_label, prefix, _entity, suffix) => {
      const state = fail(dispatch(initial(), `${prefix}_REQ`), prefix);

      expect(state[`fetching${suffix}`]).toBe(false);
      expect(state[`error${suffix}`]).toEqual(SERVER_ERROR);
    });

    it.each(RECORDS)("forgets the %s on clear", (_label, prefix, _entity, suffix) => {
      const loaded = { ...initial(), [field(suffix)]: { id: "old" }, [`fetched${suffix}`]: true,
        [`error${suffix}`]: SERVER_ERROR };
      const state = dispatch(loaded, `${prefix}_CLEAR`);

      expect(state[field(suffix)]).toEqual({});
      expect(state[`fetched${suffix}`]).toBe(false);
      expect(state[`error${suffix}`]).toBeNull();
    });

    it("decodes the benefit plan of a single contribution plan into an object", () => {
      const state = respond(initial(), "CONTRIBUTIONPLAN_CONTRIBUTIONPLAN", {
        contributionPlan: relayPage([{ id: "cp-1", benefitPlan: doublyEncoded(BENEFIT_PLAN) }]),
      });

      expect(state.contributionPlan.benefitPlan).toEqual(BENEFIT_PLAN);
    });
  });

  describe("code validation", () => {
    const VALIDATIONS = [
      ["contribution plan", "CONTRIBUTIONPLAN_CODE_FIELDS_VALIDATION", "contributionPlanCode",
        "validateContributionPlanCode"],
      ["payment plan", "PAYMENTPLAN_CODE_FIELDS_VALIDATION", "paymentPlanCode", "validatePaymentPlanCode"],
      ["contribution plan bundle", "CONTRIBUTIONPLAN_BUNDLE_CODE_FIELDS_VALIDATION", "contributionPlanBundleCode",
        "validateContributionPlanBundleCode"],
    ];
    const other = { isValidating: false, isValid: true, validationError: null };
    const withOther = () => ({ ...initial(), validationFields: { other } });

    it.each(VALIDATIONS)("starts checking the %s code without touching the other fields", (
      _label,
      prefix,
      slice,
    ) => {
      const state = dispatch(withOther(), `${prefix}_REQ`);

      expect(state.validationFields).toEqual({
        other,
        [slice]: { isValidating: true, isValid: false, validationError: null },
      });
    });

    it.each(VALIDATIONS)("takes the %s code verdict from its own query field", (_label, prefix, slice, dataField) => {
      const requested = dispatch(withOther(), `${prefix}_REQ`);

      expect(respond(requested, prefix, { [dataField]: true }).validationFields[slice])
        .toEqual({ isValidating: false, isValid: true, validationError: null });
      expect(respond(requested, prefix, { [dataField]: false }).validationFields[slice].isValid).toBe(false);
      expect(respond(requested, prefix, { [dataField]: false }).validationFields.other).toEqual(other);
    });

    it.each(VALIDATIONS)("surfaces a data error from the %s code check", (_label, prefix, slice) => {
      const state = respond(initial(), prefix, null, graphqlErrors("bad code"));

      expect(state.validationFields[slice].isValidating).toBe(false);
      expect(state.validationFields[slice].isValid).toBeFalsy();
      expect(state.validationFields[slice].validationError).toMatchObject({ detail: "bad code" });
    });

    it.each(VALIDATIONS)("treats a failed %s code check as invalid", (_label, prefix, slice) => {
      const state = fail(dispatch(initial(), `${prefix}_REQ`), prefix);

      expect(state.validationFields[slice]).toEqual({
        isValidating: false,
        isValid: false,
        validationError: SERVER_ERROR,
      });
    });

    it.each(VALIDATIONS)("accepts the %s code without asking when told it is valid", (_label, prefix, slice) => {
      const state = dispatch(withOther(), `${prefix}_SET_VALID`);

      expect(state.validationFields).toEqual({
        other,
        [slice]: { isValidating: false, isValid: true, validationError: null },
      });
    });

    // Currently fails: the CLEAR branches set isValidating: true, exactly like the request
    // branches, so once a form clears the field the code input keeps showing a check in flight.
    it.fails.each(VALIDATIONS)("stops validating the %s code on clear", (_label, prefix, slice) => {
      const validated = dispatch(initial(), `${prefix}_SET_VALID`);

      expect(dispatch(validated, `${prefix}_CLEAR`).validationFields[slice].isValidating).toBe(false);
    });

    it.each(VALIDATIONS)("forgets the %s code verdict on clear", (_label, prefix, slice) => {
      const validated = dispatch(initial(), `${prefix}_SET_VALID`);
      const cleared = dispatch(validated, `${prefix}_CLEAR`).validationFields[slice];

      expect(cleared.isValid).toBe(false);
      expect(cleared.validationError).toBeNull();
    });
  });

  describe("mutations", () => {
    const MUTATION_RESULTS = [
      ["CONTRIBUTIONPLAN_CREATE_CONTRIBUTIONPLAN_RESP", "createContributionPlan"],
      ["CONTRIBUTIONPLAN_UPDATE_CONTRIBUTIONPLAN_RESP", "updateContributionPlan"],
      ["CONTRIBUTIONPLAN_DELETE_CONTRIBUTIONPLAN_RESP", "deleteContributionPlan"],
      ["CONTRIBUTIONPLAN_CREATE_CONTRIBUTIONPLANBUNDLE_RESP", "createContributionPlanBundle"],
      ["CONTRIBUTIONPLAN_UPDATE_CONTRIBUTIONPLANBUNDLE_RESP", "updateContributionPlanBundle"],
      ["CONTRIBUTIONPLAN_DELETE_CONTRIBUTIONPLANBUNDLE_RESP", "deleteContributionPlanBundle"],
      ["CONTRIBUTIONPLAN_REPLACE_CONTRIBUTIONPLANBUNDLE_RESP", "replaceContributionPlanBundle"],
      ["CONTRIBUTIONPLAN_CREATE_CONTRIBUTIONPLANBUNDLEDETAILS_RESP", "createContributionPlanBundleDetails"],
      ["CONTRIBUTIONPLAN_UPDATE_CONTRIBUTIONPLANBUNDLEDETAILS_RESP", "updateContributionPlanBundleDetails"],
      ["CONTRIBUTIONPLAN_DELETE_CONTRIBUTIONPLANBUNDLEDETAILS_RESP", "deleteContributionPlanBundleDetails"],
      ["CONTRIBUTIONPLAN_REPLACE_CONTRIBUTIONPLANBUNDLEDETAILS_RESP", "replaceContributionPlanBundleDetails"],
      ["CONTRIBUTIONPLAN_CREATE_PAYMENTPLAN_RESP", "createPaymentPlan"],
      ["CONTRIBUTIONPLAN_UPDATE_PAYMENTPLAN_RESP", "updatePaymentPlan"],
      ["CONTRIBUTIONPLAN_REPLACE_PAYMENTPLAN_RESP", "replacePaymentPlan"],
      ["CONTRIBUTIONPLAN_DELETE_PAYMENTPLAN_RESP", "deletePaymentPlan"],
    ];

    const submitting = () => dispatch(initial(), "CONTRIBUTIONPLAN_MUTATION_REQ", {
      meta: { clientMutationId: "cmid-1", clientMutationLabel: "Create contribution plan" },
    });

    it("records the request metadata while a mutation is in flight", () => {
      expect(submitting()).toMatchObject({
        submittingMutation: true,
        mutation: { id: "cmid-1", clientMutationId: "cmid-1", clientMutationLabel: "Create contribution plan" },
      });
    });

    it.each(MUTATION_RESULTS)("clears the in-flight flag and keeps the internal id on %s", (type, service) => {
      const state = dispatch(submitting(), type, { payload: { data: { [service]: { internalId: "internal-1" } } } });

      expect(state.submittingMutation).toBe(false);
      expect(state.mutation).toMatchObject({ id: "internal-1", clientMutationId: "cmid-1" });
    });

    it("raises an alert when a mutation fails", () => {
      const payload = { status: 500, statusText: "Internal Server Error" };
      const state = fail(submitting(), "CONTRIBUTIONPLAN_MUTATION", payload);

      expect(JSON.parse(state.alert)).toEqual({ status: 500, statusText: "Internal Server Error" });
    });

    // Currently fails: dispatchMutationErr in fe-core only stores the alert, so the module is
    // left believing the mutation is still being submitted.
    it.fails("stops submitting once a mutation has failed", () => {
      expect(fail(submitting(), "CONTRIBUTIONPLAN_MUTATION", { status: 500 }).submittingMutation).toBe(false);
    });
  });
});
