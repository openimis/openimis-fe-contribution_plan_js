import {
    graphql, formatPageQuery, formatPageQueryWithCount, formatMutation, decodeId, formatGQLString
} from "@openimis/fe-core";

const CONTRIBUTIONPLAN_FULL_PROJECTION = (modulesManager) => [
    "id", "code", "name", "calculation", "jsonExt",
    "benefitPlan" + modulesManager.getProjection("product.ProductPicker.projection"),
    "periodicity", "dateValidFrom", "dateValidTo", "isDeleted"
];

const CONTRIBUTIONPLAN_PICKER_PROJECTION = () => [
    "id", "code", "name"
];

const CONTRIBUTIONPLANBUNDLE_FULL_PROJECTION = () => [
    "id", "code", "name", "periodicity", "dateValidFrom", "dateValidTo", "isDeleted", "replacementUuid"
];

const CONTRIBUTIONPLANBUNDLEDETAILS_FULL_PROJECTION = (modulesManager) => [
    "id", "contributionPlan" + `{${CONTRIBUTIONPLAN_FULL_PROJECTION(modulesManager)}}`,
    "contributionPlanBundle" + `{${CONTRIBUTIONPLANBUNDLE_FULL_PROJECTION()}}`,
    "dateValidFrom", "dateValidTo", "replacementUuid"
]

const PAYMENTPLAN_FULL_PROJECTION = (modulesManager) => [
    "id", "code", "name", "calculation", "jsonExt",
    "benefitPlan" + modulesManager.getProjection("product.ProductPicker.projection"),
    "periodicity", "dateValidFrom", "dateValidTo", "isDeleted"
];

const PAYMENTPLAN_PICKER_PROJECTION = () => [
    "id", "code", "name"
];

function dateTimeToDate(date) {
    return date.split('T')[0];
}

export function fetchContributionPlans(modulesManager, params) {
    const payload = formatPageQueryWithCount(
        "contributionPlan",
        params,
        CONTRIBUTIONPLAN_FULL_PROJECTION(modulesManager)
    );
    return graphql(payload, "CONTRIBUTIONPLAN_CONTRIBUTIONPLANS");
}

export function fetchPickerContributionPlans(params) {
    const payload = formatPageQuery(
        "contributionPlan",
        params,
        CONTRIBUTIONPLAN_PICKER_PROJECTION()
    );
    return graphql(payload, "CONTRIBUTIONPLAN_PICKERCONTRIBUTIONPLANS");
}

export function fetchContributionPlan(modulesManager, contributionPlanId) {
    let filter = !!contributionPlanId ? `id: "${contributionPlanId}"` : '';
    const payload = formatPageQuery(
        "contributionPlan",
        [filter],
        CONTRIBUTIONPLAN_FULL_PROJECTION(modulesManager)
    );
    return graphql(payload, "CONTRIBUTIONPLAN_CONTRIBUTIONPLAN");
}

export function fetchContributionPlanBundles(params) {
    const payload = formatPageQueryWithCount(
        "contributionPlanBundle",
        params,
        CONTRIBUTIONPLANBUNDLE_FULL_PROJECTION()
    );
    return graphql(payload, "CONTRIBUTIONPLAN_CONTRIBUTIONPLANBUNDLES");
}

export function fetchContributionPlanBundle(contributionPlanBundleId) {
    let filter = !!contributionPlanBundleId ? `id: "${contributionPlanBundleId}"` : '';
    const payload = formatPageQuery(
        "contributionPlanBundle",
        [filter],
        CONTRIBUTIONPLANBUNDLE_FULL_PROJECTION()
    );
    return graphql(payload, "CONTRIBUTIONPLAN_CONTRIBUTIONPLANBUNDLE");
}

export function fetchContributionPlanBundleContributionPlans(modulesManager, params) {
    const payload = formatPageQueryWithCount(
        "contributionPlanBundleDetails",
        params,
        CONTRIBUTIONPLANBUNDLEDETAILS_FULL_PROJECTION(modulesManager)
    );
    return graphql(payload, "CONTRIBUTIONPLAN_CONTRIBUTIONPLANBUNDLEDETAILS");
}

export function fetchPaymentPlans(modulesManager, params) {
    const payload = formatPageQueryWithCount(
        "paymentPlan",
        params,
        PAYMENTPLAN_FULL_PROJECTION(modulesManager)
    );
    return graphql(payload, "CONTRIBUTIONPLAN_PAYMENTPLANS");
}

export function fetchPickerPaymentPlans(params) {
    const payload = formatPageQuery(
        "paymentPlan",
        params,
        PAYMENTPLAN_PICKER_PROJECTION()
    );
    return graphql(payload, "CONTRIBUTIONPLAN_PICKERPAYMENTPLANS");
}

function formatContributionPlanGQL(contributionPlan) {
    return `
        ${!!contributionPlan.id ? `id: "${decodeId(contributionPlan.id)}"` : ''}
        ${!!contributionPlan.code ? `code: "${formatGQLString(contributionPlan.code)}"` : ""}
        ${!!contributionPlan.name ? `name: "${formatGQLString(contributionPlan.name)}"` : ""}
        ${!!contributionPlan.calculation ? `calculation: "${contributionPlan.calculation}"` : ""}
        ${!!contributionPlan.jsonExt ? `jsonExt: ${JSON.stringify(contributionPlan.jsonExt)}` : ''}
        ${!!contributionPlan.benefitPlan ? `benefitPlanId: ${decodeId(contributionPlan.benefitPlan.id)}` : ""}
        ${!!contributionPlan.periodicity ? `periodicity: ${contributionPlan.periodicity}` : ""}
        ${!!contributionPlan.dateValidFrom ? `dateValidFrom: "${dateTimeToDate(contributionPlan.dateValidFrom)}"` : ""}
        ${!!contributionPlan.dateValidTo ? `dateValidTo: "${dateTimeToDate(contributionPlan.dateValidTo)}"` : ""}
    `;
}

function formatContributionPlanBundleGQL(contributionPlanBundle, omitImmutableFields = false, isReplaceMutation = false) {
    return `
        ${!!contributionPlanBundle.id ? `${isReplaceMutation ? 'uuid' : 'id'}: "${decodeId(contributionPlanBundle.id)}"` : ''}
        ${!!contributionPlanBundle.code && !omitImmutableFields ? `code: "${formatGQLString(contributionPlanBundle.code)}"` : ""}
        ${!!contributionPlanBundle.name ? `name: "${formatGQLString(contributionPlanBundle.name)}"` : ""}
        ${!!contributionPlanBundle.periodicity ? `periodicity: ${contributionPlanBundle.periodicity}` : ""}
        ${!!contributionPlanBundle.dateValidFrom ? `dateValidFrom: "${dateTimeToDate(contributionPlanBundle.dateValidFrom)}"` : ""}
        ${!!contributionPlanBundle.dateValidTo ? `dateValidTo: "${dateTimeToDate(contributionPlanBundle.dateValidTo)}"` : ""}
    `;
}

function formatContributionPlanBundleDetailsGQL(contributionPlanBundleDetails, isReplaceMutation = false) {
    return `
        ${!!contributionPlanBundleDetails.id ? `${isReplaceMutation ? 'uuid' : 'id'}: "${decodeId(contributionPlanBundleDetails.id)}"` : ''}
        ${!!contributionPlanBundleDetails.contributionPlan ? `contributionPlanId: "${decodeId(contributionPlanBundleDetails.contributionPlan.id)}"` : ''}
        ${!!contributionPlanBundleDetails.contributionPlanBundleId ? `contributionPlanBundleId: "${contributionPlanBundleDetails.contributionPlanBundleId}"` : ''}
        ${!!contributionPlanBundleDetails.dateValidFrom ? `dateValidFrom: "${dateTimeToDate(contributionPlanBundleDetails.dateValidFrom)}"` : ""}
        ${!!contributionPlanBundleDetails.dateValidTo ? `dateValidTo: "${dateTimeToDate(contributionPlanBundleDetails.dateValidTo)}"` : ""}
    `;
}

export function createContributionPlan(contributionPlan, clientMutationLabel) {
    let mutation = formatMutation("createContributionPlan", formatContributionPlanGQL(contributionPlan), clientMutationLabel);
    var requestedDateTime = new Date();
    return graphql(
        mutation.payload,
        ["CONTRIBUTIONPLAN_MUTATION_REQ", "CONTRIBUTIONPLAN_CREATE_CONTRIBUTIONPLAN_RESP", "CONTRIBUTIONPLAN_MUTATION_ERR"],
        {
            clientMutationId: mutation.clientMutationId,
            clientMutationLabel,
            requestedDateTime
        }
    );
}

export function updateContributionPlan(contributionPlan, clientMutationLabel) {
    let mutation = formatMutation("updateContributionPlan", formatContributionPlanGQL(contributionPlan), clientMutationLabel);
    var requestedDateTime = new Date();
    return graphql(
        mutation.payload,
        ["CONTRIBUTIONPLAN_MUTATION_REQ", "CONTRIBUTIONPLAN_UPDATE_CONTRIBUTIONPLAN_RESP", "CONTRIBUTIONPLAN_MUTATION_ERR"],
        {
            clientMutationId: mutation.clientMutationId,
            clientMutationLabel,
            requestedDateTime
        }
    );
}

export function deleteContributionPlan(contributionPlan, clientMutationLabel, clientMutationDetails = null) {
    let contributionPlanUuids = `uuids: ["${decodeId(contributionPlan.id)}"]`;
    let mutation = formatMutation("deleteContributionPlan", contributionPlanUuids, clientMutationLabel, clientMutationDetails);
    var requestedDateTime = new Date();
    return graphql(
        mutation.payload,
        ["CONTRIBUTIONPLAN_MUTATION_REQ", "CONTRIBUTIONPLAN_DELETE_CONTRIBUTIONPLAN_RESP", "CONTRIBUTIONPLAN_MUTATION_ERR"],
        {
            clientMutationId: mutation.clientMutationId,
            clientMutationLabel,
            requestedDateTime
        }
    );
}

export function createContributionPlanBundle(contributionPlanBundle, clientMutationLabel) {
    let mutation = formatMutation("createContributionPlanBundle", formatContributionPlanBundleGQL(contributionPlanBundle), clientMutationLabel);
    var requestedDateTime = new Date();
    return graphql(
        mutation.payload,
        ["CONTRIBUTIONPLAN_MUTATION_REQ", "CONTRIBUTIONPLAN_CREATE_CONTRIBUTIONPLANBUNDLE_RESP", "CONTRIBUTIONPLAN_MUTATION_ERR"],
        {
            clientMutationId: mutation.clientMutationId,
            clientMutationLabel,
            requestedDateTime
        }
    );
}

export function updateContributionPlanBundle(contributionPlanBundle, clientMutationLabel) {
    let mutation = formatMutation("updateContributionPlanBundle", formatContributionPlanBundleGQL(contributionPlanBundle, true), clientMutationLabel);
    var requestedDateTime = new Date();
    return graphql(
        mutation.payload,
        ["CONTRIBUTIONPLAN_MUTATION_REQ", "CONTRIBUTIONPLAN_UPDATE_CONTRIBUTIONPLANBUNDLE_RESP", "CONTRIBUTIONPLAN_MUTATION_ERR"],
        {
            clientMutationId: mutation.clientMutationId,
            clientMutationLabel,
            requestedDateTime
        }
    );
}

export function deleteContributionPlanBundle(contributionPlanBundle, clientMutationLabel, clientMutationDetails = null) {
    let contributionPlanBundleUuids = `uuids: ["${decodeId(contributionPlanBundle.id)}"]`;
    let mutation = formatMutation("deleteContributionPlanBundle", contributionPlanBundleUuids, clientMutationLabel, clientMutationDetails);
    var requestedDateTime = new Date();
    return graphql(
        mutation.payload,
        ["CONTRIBUTIONPLAN_MUTATION_REQ", "CONTRIBUTIONPLAN_DELETE_CONTRIBUTIONPLANBUNDLE_RESP", "CONTRIBUTIONPLAN_MUTATION_ERR"],
        {
            clientMutationId: mutation.clientMutationId,
            clientMutationLabel,
            requestedDateTime
        }
    );
}

export function replaceContributionPlanBundle(contributionPlanBundle, clientMutationLabel) {
    let mutation = formatMutation("replaceContributionPlanBundle", formatContributionPlanBundleGQL(contributionPlanBundle, true, true), clientMutationLabel);
    var requestedDateTime = new Date();
    return graphql(
        mutation.payload,
        ["CONTRIBUTIONPLAN_MUTATION_REQ", "CONTRIBUTIONPLAN_REPLACE_CONTRIBUTIONPLANBUNDLE_RESP", "CONTRIBUTIONPLAN_MUTATION_ERR"],
        {
            clientMutationId: mutation.clientMutationId,
            clientMutationLabel,
            requestedDateTime
        }
    );
}

export function createContributionPlanBundleContributionPlan(contributionPlanBundleContributionPlan, clientMutationLabel) {
    let mutation = formatMutation("createContributionPlanBundleDetails", formatContributionPlanBundleDetailsGQL(contributionPlanBundleContributionPlan), clientMutationLabel);
    var requestedDateTime = new Date();
    return graphql(
        mutation.payload,
        ["CONTRIBUTIONPLAN_MUTATION_REQ", "CONTRIBUTIONPLAN_CREATE_CONTRIBUTIONPLANBUNDLEDETAILS_RESP", "CONTRIBUTIONPLAN_MUTATION_ERR"],
        {
            clientMutationId: mutation.clientMutationId,
            clientMutationLabel,
            requestedDateTime
        }
    );
}

export function updateContributionPlanBundleContributionPlan(contributionPlanBundleContributionPlan, clientMutationLabel) {
    let mutation = formatMutation("updateContributionPlanBundleDetails", formatContributionPlanBundleDetailsGQL(contributionPlanBundleContributionPlan), clientMutationLabel);
    var requestedDateTime = new Date();
    return graphql(
        mutation.payload,
        ["CONTRIBUTIONPLAN_MUTATION_REQ", "CONTRIBUTIONPLAN_UPDATE_CONTRIBUTIONPLANBUNDLEDETAILS_RESP", "CONTRIBUTIONPLAN_MUTATION_ERR"],
        {
            clientMutationId: mutation.clientMutationId,
            clientMutationLabel,
            requestedDateTime
        }
    );
}

export function deleteContributionPlanBundleContributionPlan(contributionPlanBundleContributionPlan, clientMutationLabel, clientMutationDetails = null) {
    let contributionPlanBundleContributionPlanUuids = `uuids: ["${decodeId(contributionPlanBundleContributionPlan.id)}"]`;
    let mutation = formatMutation("deleteContributionPlanBundleDetails", contributionPlanBundleContributionPlanUuids, clientMutationLabel, clientMutationDetails);
    var requestedDateTime = new Date();
    return graphql(
        mutation.payload,
        ["CONTRIBUTIONPLAN_MUTATION_REQ", "CONTRIBUTIONPLAN_DELETE_CONTRIBUTIONPLANBUNDLEDETAILS_RESP", "CONTRIBUTIONPLAN_MUTATION_ERR"],
        {
            clientMutationId: mutation.clientMutationId,
            clientMutationLabel,
            requestedDateTime
        }
    );
}

export function replaceContributionPlanBundleContributionPlan(contributionPlanBundleContributionPlan, clientMutationLabel) {
    let mutation = formatMutation("replaceContributionPlanBundleDetails", formatContributionPlanBundleDetailsGQL(contributionPlanBundleContributionPlan, true), clientMutationLabel);
    var requestedDateTime = new Date();
    return graphql(
        mutation.payload,
        ["CONTRIBUTIONPLAN_MUTATION_REQ", "CONTRIBUTIONPLAN_REPLACE_CONTRIBUTIONPLANBUNDLEDETAILS_RESP", "CONTRIBUTIONPLAN_MUTATION_ERR"],
        {
            clientMutationId: mutation.clientMutationId,
            clientMutationLabel,
            requestedDateTime
        }
    );
}

export function deletePaymentPlan(paymentPlan, clientMutationLabel, clientMutationDetails = null) {
    let paymentPlanUuids = `uuids: ["${decodeId(paymentPlan.id)}"]`;
    let mutation = formatMutation("deletePaymentPlan", paymentPlanUuids, clientMutationLabel, clientMutationDetails);
    var requestedDateTime = new Date();
    return graphql(
        mutation.payload,
        ["CONTRIBUTIONPLAN_MUTATION_REQ", "CONTRIBUTIONPLAN_DELETE_PAYMENTPLAN_RESP", "CONTRIBUTIONPLAN_MUTATION_ERR"],
        {
            clientMutationId: mutation.clientMutationId,
            clientMutationLabel,
            requestedDateTime
        }
    );
}
