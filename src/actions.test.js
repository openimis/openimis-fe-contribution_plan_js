import { describe, expect, it, vi } from "vitest";

// Only fe-core's two dispatchers are stubbed; the formatters are real, imported from their
// defining module because fe-core's barrel imports itself.
const core = vi.hoisted(() => ({
  graphql: vi.fn((payload, type, meta) => ({ payload, type, meta })),
  graphqlWithVariables: vi.fn((operation, variables, type, meta) => ({ operation, variables, type, meta })),
}));

vi.mock("@openimis/fe-core", async () => ({
  ...(await vi.importActual("@openimis/fe-core/helpers/api")),
  ...core,
}));

const actions = await import("./actions");
const { globalId } = await import("@openimis/fe-core/testing");

const modulesManager = { getProjection: () => "{id}" };
const query = (result) => result.payload.replace(/\s+/g, " ");
const operation = (result) => result.operation.replace(/\s+/g, " ");
const thunkDispatches = (thunk) => {
  const dispatch = vi.fn();
  thunk(dispatch);
  return dispatch.mock.calls.map(([action]) => action);
};

const MUTATION_TYPES = (resp) => ["CONTRIBUTIONPLAN_MUTATION_REQ", resp, "CONTRIBUTIONPLAN_MUTATION_ERR"];

describe("contribution plan actions", () => {
  describe("searches", () => {
    it.each([
      ["contribution plans", () => actions.fetchContributionPlans(modulesManager, ["first: 10"]),
        "CONTRIBUTIONPLAN_CONTRIBUTIONPLANS", "contributionPlan"],
      ["contribution plan bundles", () => actions.fetchContributionPlanBundles(["first: 10"]),
        "CONTRIBUTIONPLAN_CONTRIBUTIONPLANBUNDLES", "contributionPlanBundle"],
      ["bundle contribution plans",
        () => actions.fetchContributionPlanBundleContributionPlans(modulesManager, ["first: 10"]),
        "CONTRIBUTIONPLAN_CONTRIBUTIONPLANBUNDLEDETAILS", "contributionPlanBundleDetails"],
      ["payment plans", () => actions.fetchPaymentPlans(modulesManager, ["first: 10"]),
        "CONTRIBUTIONPLAN_PAYMENTPLANS", "paymentPlan"],
    ])("asks for a counted page of %s", (_label, fetch, type, entity) => {
      const result = fetch();

      expect(result.type).toBe(type);
      expect(query(result)).toContain(`${entity}(first: 10) { totalCount`);
      expect(query(result)).toContain("edges { node {");
    });

    it.each([
      ["contribution plan", () => actions.fetchPickerContributionPlans(modulesManager, ["code_Icontains: \"A\""]),
        "CONTRIBUTIONPLAN_PICKERCONTRIBUTIONPLANS", "contributionPlan", "id,code,name"],
      ["payment plan", () => actions.fetchPickerPaymentPlans(modulesManager, ["code_Icontains: \"A\""]),
        "CONTRIBUTIONPLAN_PICKERPAYMENTPLANS", "paymentPlan", "id,code,name,benefitPlan"],
    ])("asks the %s picker for a short projection without counting", (_label, fetch, type, entity, projection) => {
      const result = fetch();

      expect(result.type).toBe(type);
      expect(query(result)).toContain(`${entity}(code_Icontains: "A")`);
      expect(query(result)).toContain(`node { ${projection} }`);
      expect(query(result)).not.toContain("totalCount");
    });

    it("projects the benefit plan and its model on contribution plans", () => {
      const sent = query(actions.fetchContributionPlans(modulesManager, []));

      expect(sent).toContain("id,code,name,calculation,jsonExt,benefitPlan,benefitPlanType_Model,periodicity");
      expect(sent).toContain("dateValidFrom,dateValidTo,isDeleted");
    });

    it("projects the benefit plan type and its name on payment plans", () => {
      expect(query(actions.fetchPaymentPlans(modulesManager, [])))
        .toContain("benefitPlan,benefitPlanType,benefitPlanTypeName,periodicity");
    });

    it("nests the full contribution plan and bundle inside each bundle detail", () => {
      const sent = query(actions.fetchContributionPlanBundleContributionPlans(modulesManager, []));

      expect(sent).toContain("contributionPlan{id,code,name,calculation,jsonExt,benefitPlan,");
      expect(sent).toContain("contributionPlanBundle{id,code,name,periodicity,dateValidFrom,dateValidTo,isDeleted,"
        + "replacementUuid}");
    });
  });

  describe("single records", () => {
    it.each([
      ["contribution plan", () => actions.fetchContributionPlan(modulesManager, "cp-1"),
        "CONTRIBUTIONPLAN_CONTRIBUTIONPLAN", "contributionPlan(id: \"cp-1\")"],
      ["contribution plan bundle", () => actions.fetchContributionPlanBundle("cpb-1"),
        "CONTRIBUTIONPLAN_CONTRIBUTIONPLANBUNDLE", "contributionPlanBundle(id: \"cpb-1\")"],
      ["payment plan", () => actions.fetchPaymentPlan(modulesManager, "pp-1"),
        "CONTRIBUTIONPLAN_PAYMENTPLAN", "paymentPlan(id: \"pp-1\")"],
    ])("loads one %s by id without counting", (_label, fetch, type, fragment) => {
      const result = fetch();

      expect(result.type).toBe(type);
      expect(query(result)).toContain(fragment);
      expect(query(result)).not.toContain("totalCount");
    });

    it("looks up a new bundle by the client mutation id that created it", () => {
      const result = actions.fetchContributionPlanBundle(null, ["clientMutationId: \"cmid-1\""]);

      expect(query(result)).toContain("contributionPlanBundle(clientMutationId: \"cmid-1\"");
      expect(query(result)).not.toContain("id: \"null\"");
    });

    // Currently fails: the id filter is pushed onto the caller's own array instead of a copy.
    it.fails("leaves the filters it was given alone", () => {
      const filters = ["clientMutationId: \"cmid-1\""];
      actions.fetchContributionPlanBundle("cpb-1", filters);

      expect(filters).toEqual(["clientMutationId: \"cmid-1\""]);
    });

    it.each([
      ["contribution plan", actions.clearContributionPlan, "CONTRIBUTIONPLAN_CONTRIBUTIONPLAN_CLEAR"],
      ["contribution plan bundle", actions.clearContributionPlanBundle,
        "CONTRIBUTIONPLAN_CONTRIBUTIONPLANBUNDLE_CLEAR"],
      ["bundle contribution plans", actions.clearContributionPlanBundleDetails,
        "CONTRIBUTIONPLAN_CONTRIBUTIONPLANBUNDLEDETAILS_CLEAR"],
      ["payment plan", actions.clearPaymentPlan, "CONTRIBUTIONPLAN_PAYMENTPLAN_CLEAR"],
    ])("clears the %s", (_label, creator, type) => {
      expect(thunkDispatches(creator())).toEqual([{ type }]);
    });
  });

  describe("mutation plumbing", () => {
    const gid = (value) => globalId("SomeType", value);
    const BENEFIT_PLAN = { id: "3fa85f64-5717-4562-b3fc-2c963f66afa6" };
    const MUTATIONS = [
      ["createContributionPlan", () => actions.createContributionPlan({ code: "CP1" }, "label"),
        "CONTRIBUTIONPLAN_CREATE_CONTRIBUTIONPLAN_RESP"],
      ["updateContributionPlan", () => actions.updateContributionPlan({ id: gid("cp-1") }, "label"),
        "CONTRIBUTIONPLAN_UPDATE_CONTRIBUTIONPLAN_RESP"],
      ["deleteContributionPlan", () => actions.deleteContributionPlan({ id: gid("cp-1") }, "label"),
        "CONTRIBUTIONPLAN_DELETE_CONTRIBUTIONPLAN_RESP"],
      ["createContributionPlanBundle", () => actions.createContributionPlanBundle({ code: "B1" }, "label"),
        "CONTRIBUTIONPLAN_CREATE_CONTRIBUTIONPLANBUNDLE_RESP"],
      ["updateContributionPlanBundle", () => actions.updateContributionPlanBundle({ id: gid("cpb-1") }, "label"),
        "CONTRIBUTIONPLAN_UPDATE_CONTRIBUTIONPLANBUNDLE_RESP"],
      ["deleteContributionPlanBundle", () => actions.deleteContributionPlanBundle({ id: gid("cpb-1") }, "label"),
        "CONTRIBUTIONPLAN_DELETE_CONTRIBUTIONPLANBUNDLE_RESP"],
      ["replaceContributionPlanBundle", () => actions.replaceContributionPlanBundle({ id: gid("cpb-1") }, "label"),
        "CONTRIBUTIONPLAN_REPLACE_CONTRIBUTIONPLANBUNDLE_RESP"],
      ["createContributionPlanBundleDetails",
        () => actions.createContributionPlanBundleContributionPlan({ contributionPlanBundleId: "cpb-1" }, "label"),
        "CONTRIBUTIONPLAN_CREATE_CONTRIBUTIONPLANBUNDLEDETAILS_RESP"],
      ["updateContributionPlanBundleDetails",
        () => actions.updateContributionPlanBundleContributionPlan({ id: gid("d-1") }, "label"),
        "CONTRIBUTIONPLAN_UPDATE_CONTRIBUTIONPLANBUNDLEDETAILS_RESP"],
      ["deleteContributionPlanBundleDetails",
        () => actions.deleteContributionPlanBundleContributionPlan({ id: gid("d-1") }, "label"),
        "CONTRIBUTIONPLAN_DELETE_CONTRIBUTIONPLANBUNDLEDETAILS_RESP"],
      ["replaceContributionPlanBundleDetails",
        () => actions.replaceContributionPlanBundleContributionPlan({ id: gid("d-1") }, "label"),
        "CONTRIBUTIONPLAN_REPLACE_CONTRIBUTIONPLANBUNDLEDETAILS_RESP"],
      ["createPaymentPlan", () => actions.createPaymentPlan({ code: "PP1", benefitPlan: BENEFIT_PLAN }, "label"),
        "CONTRIBUTIONPLAN_CREATE_PAYMENTPLAN_RESP"],
      ["updatePaymentPlan", () => actions.updatePaymentPlan({ id: gid("pp-1"), benefitPlan: BENEFIT_PLAN }, "label"),
        "CONTRIBUTIONPLAN_UPDATE_PAYMENTPLAN_RESP"],
      ["replacePaymentPlan", () => actions.replacePaymentPlan({ id: gid("pp-1"), benefitPlan: BENEFIT_PLAN }, "label"),
        "CONTRIBUTIONPLAN_REPLACE_PAYMENTPLAN_RESP"],
      ["deletePaymentPlan", () => actions.deletePaymentPlan({ id: gid("pp-1") }, "label"),
        "CONTRIBUTIONPLAN_DELETE_PAYMENTPLAN_RESP"],
    ];

    it.each(MUTATIONS)("sends %s and raises its own success type", (name, mutate, resp) => {
      const result = mutate();

      expect(query(result)).toContain(`mutation ${name} { ${name}( input: {`);
      expect(result.type).toEqual(MUTATION_TYPES(resp));
      expect(query(result)).toContain(`clientMutationId: "${result.meta.clientMutationId}"`);
      expect(query(result)).toContain("clientMutationLabel: \"label\"");
      expect(result.meta.clientMutationLabel).toBe("label");
      expect(result.meta.requestedDateTime).toBeInstanceOf(Date);
    });

    it.each([
      ["deleteContributionPlan", actions.deleteContributionPlan],
      ["deleteContributionPlanBundle", actions.deleteContributionPlanBundle],
      ["deleteContributionPlanBundleDetails", actions.deleteContributionPlanBundleContributionPlan],
      ["deletePaymentPlan", actions.deletePaymentPlan],
    ])("addresses %s by a list of decoded uuids and passes the details through", (_name, creator) => {
      const sent = query(creator({ id: globalId("SomeType", "uuid-1") }, "label", { reason: "typo" }));

      expect(sent).toContain("uuids: [\"uuid-1\"]");
      expect(sent).toContain("clientMutationDetails: {\"reason\":\"typo\"}");
    });
  });

  describe("contribution plan input", () => {
    const contributionPlan = {
      id: globalId("ContributionPlanGQLType", "cp-uuid"),
      code: "CP1",
      name: "Standard",
      calculation: "calc-uuid",
      jsonExt: "{\"rate\": 5}",
      benefitPlan: { id: globalId("ProductGQLType", "7") },
      periodicity: 3,
      dateValidFrom: "2026-01-01T00:00:00",
      dateValidTo: "2026-12-31T00:00:00",
    };

    it("sends every field the form filled in, with decoded ids and bare dates", () => {
      const sent = query(actions.updateContributionPlan(contributionPlan, "Update"));

      expect(sent).toContain("id: \"cp-uuid\"");
      expect(sent).toContain("code: \"CP1\"");
      expect(sent).toContain("name: \"Standard\"");
      expect(sent).toContain("calculation: \"calc-uuid\"");
      expect(sent).toContain("jsonExt: \"{\\\"rate\\\": 5}\"");
      expect(sent).toContain("benefitPlanId: \"7\"");
      expect(sent).toContain("periodicity: 3");
      expect(sent).toContain("dateValidFrom: \"2026-01-01\"");
      expect(sent).toContain("dateValidTo: \"2026-12-31\"");
    });

    it("always ties a contribution plan to a product", () => {
      expect(query(actions.createContributionPlan({ code: "CP1" }, "Create")))
        .toContain("benefitPlanType_Model: \"product\"");
    });

    it("passes a benefit plan uuid through without decoding it", () => {
      const sent = query(actions.createContributionPlan(
        { benefitPlan: { id: "3fa85f64-5717-4562-b3fc-2c963f66afa6" } },
        "Create",
      ));

      expect(sent).toContain("benefitPlanId: \"3fa85f64-5717-4562-b3fc-2c963f66afa6\"");
    });

    it("omits the fields that were never filled in", () => {
      const sent = query(actions.createContributionPlan({ code: "CP1" }, "Create"));

      ["id:", "name:", "calculation:", "jsonExt:", "benefitPlanId:", "periodicity:", "dateValidFrom:", "dateValidTo:"]
        .forEach((field) => expect(sent).not.toContain(field));
    });

    // Currently fails: formatGQLString escapes the quote first and the backslash second, so its
    // own escape character is escaped again and the server receives a syntax error.
    it.fails("escapes a name the user typed quotes into", () => {
      expect(query(actions.createContributionPlan({ name: "The \"big\" plan" }, "Create")))
        .toContain("name: \"The \\\"big\\\" plan\"");
    });
  });

  describe("contribution plan bundle input", () => {
    const bundle = {
      id: globalId("ContributionPlanBundleGQLType", "cpb-uuid"),
      code: "B1",
      name: "Bundle",
      periodicity: 12,
      dateValidFrom: "2026-01-01T00:00:00",
      dateValidTo: "2026-12-31T00:00:00",
    };

    it("sends the code only when creating", () => {
      const created = query(actions.createContributionPlanBundle(bundle, "Create"));

      expect(created).toContain("id: \"cpb-uuid\"");
      expect(created).toContain("code: \"B1\"");
      expect(created).toContain("name: \"Bundle\"");
      expect(created).toContain("periodicity: 12");
      expect(created).toContain("dateValidFrom: \"2026-01-01\"");
      expect(created).toContain("dateValidTo: \"2026-12-31\"");
      expect(query(actions.updateContributionPlanBundle(bundle, "Update"))).not.toContain("code:");
    });

    it("addresses a replacement by uuid rather than id and leaves the code alone", () => {
      const sent = query(actions.replaceContributionPlanBundle(bundle, "Replace"));

      expect(sent).toContain("uuid: \"cpb-uuid\"");
      expect(sent).not.toMatch(/\bid:/);
      expect(sent).not.toContain("code:");
      expect(sent).toContain("name: \"Bundle\"");
    });
  });

  describe("bundle contribution plan input", () => {
    const detail = {
      id: globalId("ContributionPlanBundleDetailsGQLType", "d-uuid"),
      contributionPlan: { id: globalId("ContributionPlanGQLType", "cp-uuid") },
      contributionPlanBundleId: "cpb-uuid",
      dateValidFrom: "2026-01-01T00:00:00",
      dateValidTo: "2026-06-30T00:00:00",
    };

    it("links the decoded contribution plan to the bundle it was added to", () => {
      const sent = query(actions.createContributionPlanBundleContributionPlan(detail, "Add"));

      expect(sent).toContain("id: \"d-uuid\"");
      expect(sent).toContain("contributionPlanId: \"cp-uuid\"");
      expect(sent).toContain("contributionPlanBundleId: \"cpb-uuid\"");
      expect(sent).toContain("dateValidFrom: \"2026-01-01\"");
      expect(sent).toContain("dateValidTo: \"2026-06-30\"");
    });

    it("addresses a replacement by uuid rather than id", () => {
      const sent = query(actions.replaceContributionPlanBundleContributionPlan(detail, "Replace"));

      expect(sent).toContain("uuid: \"d-uuid\"");
      expect(sent).not.toMatch(/\bid:/);
      expect(query(actions.updateContributionPlanBundleContributionPlan(detail, "Update"))).toContain("id: \"d-uuid\"");
    });

    it("omits the links that were never chosen", () => {
      const sent = query(actions.createContributionPlanBundleContributionPlan({}, "Add"));

      expect(sent).not.toContain("contributionPlanId:");
      expect(sent).not.toContain("contributionPlanBundleId:");
    });
  });

  describe("payment plan input", () => {
    const paymentPlan = () => ({
      id: globalId("PaymentPlanGQLType", "pp-uuid"),
      code: "PP1",
      name: "Monthly",
      calculation: "calc-uuid",
      jsonExt: "{\"advanced_criteria\": []}",
      benefitPlanTypeName: "benefit plan",
      benefitPlan: { id: globalId("BenefitPlanGQLType", "bp-uuid") },
      periodicity: 1,
      dateValidFrom: "2026-01-01T00:00:00",
      dateValidTo: "2026-12-31T00:00:00",
    });

    it("sends every field the form filled in, with decoded ids and bare dates", () => {
      const sent = query(actions.updatePaymentPlan(paymentPlan(), "Update"));

      expect(sent).toContain("id: \"pp-uuid\"");
      expect(sent).toContain("code: \"PP1\"");
      expect(sent).toContain("name: \"Monthly\"");
      expect(sent).toContain("calculation: \"calc-uuid\"");
      expect(sent).toContain("jsonExt: \"{\\\"advanced_criteria\\\": []}\"");
      expect(sent).toContain("benefitPlanId: \"bp-uuid\"");
      expect(sent).toContain("periodicity: 1");
      expect(sent).toContain("dateValidFrom: \"2026-01-01\"");
      expect(sent).toContain("dateValidTo: \"2026-12-31\"");
    });

    it("strips the spaces from the plan type to name its model", () => {
      expect(query(actions.createPaymentPlan(paymentPlan(), "Create")))
        .toContain("benefitPlanType_Model: \"benefitplan\"");
    });

    it("reads a benefit plan still held as JSON text", () => {
      const sent = query(actions.createPaymentPlan(
        { ...paymentPlan(), benefitPlan: JSON.stringify({ id: globalId("ProductGQLType", "9") }) },
        "Create",
      ));

      expect(sent).toContain("benefitPlanId: \"9\"");
    });

    it("passes a benefit plan uuid through without decoding it", () => {
      const sent = query(actions.createPaymentPlan(
        { ...paymentPlan(), benefitPlan: { id: "3fa85f64-5717-4562-b3fc-2c963f66afa6" } },
        "Create",
      ));

      expect(sent).toContain("benefitPlanId: \"3fa85f64-5717-4562-b3fc-2c963f66afa6\"");
    });

    it("addresses a replacement by uuid rather than id", () => {
      const sent = query(actions.replacePaymentPlan(paymentPlan(), "Replace"));

      expect(sent).toContain("uuid: \"pp-uuid\"");
      expect(sent).not.toMatch(/\bid:/);
      expect(sent).toContain("code: \"PP1\"");
    });

    it("omits the fields that were never filled in", () => {
      const sent = query(actions.createPaymentPlan({ code: "PP1", benefitPlan: null }, "Create"));

      ["id:", "name:", "calculation:", "jsonExt:", "benefitPlanType_Model:", "benefitPlanId:", "periodicity:",
        "dateValidFrom:", "dateValidTo:"].forEach((field) => expect(sent).not.toContain(field));
    });

    // Currently fails: the formatter writes the parsed benefit plan back onto the object it was
    // given, which is the form's own state.
    it.fails("leaves the payment plan it was given alone", () => {
      const given = { ...paymentPlan(), benefitPlan: JSON.stringify({ id: "bp-uuid" }) };
      actions.createPaymentPlan(given, "Create");

      expect(given.benefitPlan).toBe(JSON.stringify({ id: "bp-uuid" }));
    });
  });

  describe("code validation", () => {
    const VALIDATIONS = [
      ["contribution plan", actions.contributionPlanCodeValidation, "contributionPlanCode",
        "validateContributionPlanCode", "CONTRIBUTIONPLAN_CODE_FIELDS_VALIDATION",
        actions.contributionPlanCodeSetValid, actions.contributionPlanCodeClear],
      ["payment plan", actions.paymentPlanCodeValidation, "paymentPlanCode", "validatePaymentPlanCode",
        "PAYMENTPLAN_CODE_FIELDS_VALIDATION", actions.paymentPlanCodeSetValid, actions.paymentPlanCodeClear],
      ["contribution plan bundle", actions.contributionPlanBundleCodeValidation, "contributionPlanBundleCode",
        "validateContributionPlanBundleCode", "CONTRIBUTIONPLAN_BUNDLE_CODE_FIELDS_VALIDATION",
        actions.contributionPlanBundleCodeSetValid, actions.contributionPlanBundleCodeClear],
    ];

    it.each(VALIDATIONS)("asks the server whether the %s code is free", (_label, validate, variable, field, type) => {
      const result = validate(modulesManager, { [variable]: "X1" });

      expect(result.type).toBe(type);
      expect(result.variables).toEqual({ [variable]: "X1" });
      expect(operation(result)).toContain(`query ($${variable}: String!) { ${field}(${variable}: $${variable}) }`);
    });

    it.each(VALIDATIONS)("marks the %s code valid or clears it", (_l, _v, _var, _f, type, setValid, clear) => {
      expect(thunkDispatches(setValid())).toEqual([{ type: `${type}_SET_VALID` }]);
      expect(thunkDispatches(clear())).toEqual([{ type: `${type}_CLEAR` }]);
    });
  });
});
