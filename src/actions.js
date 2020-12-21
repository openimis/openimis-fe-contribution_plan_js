import {
    graphql, formatPageQueryWithCount, formatMutation, decodeId, formatGQLString
} from "@openimis/fe-core";

const CONTRIBUTIONPLAN_FULL_PROJECTION = (modulesManager) => [
    "id", "code", "name", "calculation{id}",
    "benefitPlan" + modulesManager.getProjection("product.ProductPicker.projection"),
    "periodicity", "dateValidFrom", "dateValidTo"
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

function formatContributionPlanGQL(contributionPlan) {
    return `
        ${!!contributionPlan.id ? `id: "${decodeId(contributionPlan.id)}"` : ''}
        ${!!contributionPlan.code ? `code: "${formatGQLString(contributionPlan.code)}"` : ""}
        ${!!contributionPlan.name ? `name: "${formatGQLString(contributionPlan.name)}"` : ""}
        ${!!contributionPlan.calculation ? `calculationId: "${contributionPlan.calculation}"` : ""} 
        ${!!contributionPlan.benefitPlan ? `benefitPlanId: ${decodeId(contributionPlan.benefitPlan.id)}` : ""}
        ${!!contributionPlan.periodicity ? `periodicity: ${contributionPlan.periodicity}` : ""}
        ${!!contributionPlan.dateValidFrom ? `dateValidFrom: "${dateTimeToDate(contributionPlan.dateValidFrom)}"` : ""}
        ${!!contributionPlan.dateValidTo ? `dateValidTo: "${dateTimeToDate(contributionPlan.dateValidTo)}"` : ""}
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
