import {
    formatServerError, formatGraphQLError, parseData, pageInfo,
    dispatchMutationReq, dispatchMutationResp, dispatchMutationErr
} from "@openimis/fe-core";

function reducer(
    state = {
        fetchingContributionPlans: false,
        errorContributionPlans: null,
        fetchedContributionPlans: false,
        contributionPlans: [],
        contributionPlansPageInfo: {},
        contributionPlansTotalCount: 0,
        fetchingContributionPlan: false,
        fetchedContributionPlan: false,
        contributionPlan: {},
        errorContributionPlan: null
    },
    action
) {
    switch(action.type) {
        case "CONTRIBUTIONPLAN_CONTRIBUTIONPLANS_REQ":
            return {
                ...state,
                fetchingContributionPlans: true,
                fetchedContributionPlans: false,
                contributionPlans: [],
                contributionPlansPageInfo: {},
                contributionPlansTotalCount: 0,
                errorContributionPlans: null
            };
        case "CONTRIBUTIONPLAN_CONTRIBUTIONPLANS_RESP":
            return {
                ...state,
                fetchingContributionPlans: false,
                fetchedContributionPlans: true,
                contributionPlans: parseData(action.payload.data.contributionPlan),
                contributionPlansPageInfo: pageInfo(action.payload.data.contributionPlan),
                contributionPlansTotalCount: !!action.payload.data.contributionPlan ? action.payload.data.contributionPlan.totalCount : null,
                errorContributionPlans: formatGraphQLError(action.payload)
            };
        case "CONTRIBUTIONPLAN_CONTRIBUTIONPLANS_ERR":
            return {
                ...state,
                fetchingContributionPlans: false,
                errorContributionPlans: formatServerError(action.payload)
            };
        case "CONTRIBUTIONPLAN_CONTRIBUTIONPLAN_REQ":
            return {
                ...state,
                fetchingContributionPlan: true,
                fetchedContributionPlan: false,
                contributionPlan: [],
                errorContributionPlan: null
            };
        case "CONTRIBUTIONPLAN_CONTRIBUTIONPLAN_RESP":
            return {
                ...state,
                fetchingContributionPlan: false,
                fetchedContributionPlan: true,
                contributionPlan: parseData(action.payload.data.contributionPlan).find(contributionPlan => !!contributionPlan),
                errorContributionPlan: formatGraphQLError(action.payload)
            };
        case "CONTRIBUTIONPLAN_CONTRIBUTIONPLAN_ERR":
            return {
                ...state,
                fetchingContributionPlan: false,
                errorContributionPlan: formatServerError(action.payload)
            };
        case "CONTRIBUTIONPLAN_MUTATION_REQ":
            return dispatchMutationReq(state, action);
        case "CONTRIBUTIONPLAN_MUTATION_ERR":
            return dispatchMutationErr(state, action);
        case "CONTRIBUTIONPLAN_CREATE_CONTRIBUTIONPLAN_RESP":
            return dispatchMutationResp(state, "createContributionPlan", action);
        case "CONTRIBUTIONPLAN_UPDATE_CONTRIBUTIONPLAN_RESP":
            return dispatchMutationResp(state, "updateContributionPlan", action);
        default:
            return state;
    }
}

export default reducer;
