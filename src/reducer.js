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
        case "CONTRIBUTIONPLAN_MUTATION_REQ":
            return dispatchMutationReq(state, action);
        case "CONTRIBUTIONPLAN_MUTATION_ERR":
            return dispatchMutationErr(state, action);
        case "CONTRIBUTIONPLAN_CREATE_CONTRIBUTIONPLAN_RESP":
            return dispatchMutationResp(state, "createContributionPlan", action);
        default:
            return state;
    }
}

export default reducer;
