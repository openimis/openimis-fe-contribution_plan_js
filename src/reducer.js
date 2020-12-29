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
        errorContributionPlan: null,
        fetchingContributionPlanBundles: false,
        errorContributionPlanBundles: null,
        fetchedContributionPlanBundles: false,
        contributionPlanBundles: [],
        contributionPlanBundlesPageInfo: {},
        contributionPlanBundlesTotalCount: 0,
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
        case "CONTRIBUTIONPLAN_CONTRIBUTIONPLANBUNDLES_REQ":
            return {
                ...state,
                fetchingContributionPlanBundles: true,
                fetchedContributionPlanBundles: false,
                contributionPlanBundles: [],
                contributionPlanBundlesPageInfo: {},
                contributionPlanBundlesTotalCount: 0,
                errorContributionPlanBundles: null
            };
        case "CONTRIBUTIONPLAN_CONTRIBUTIONPLANBUNDLES_RESP":
            return {
                ...state,
                fetchingContributionPlanBundles: false,
                fetchedContributionPlanBundles: true,
                contributionPlanBundles: parseData(action.payload.data.contributionPlanBundle),
                contributionPlanBundlesPageInfo: pageInfo(action.payload.data.contributionPlanBundle),
                contributionPlanBundlesTotalCount: !!action.payload.data.contributionPlanBundle ? action.payload.data.contributionPlanBundle.totalCount : null,
                errorContributionPlanBundles: formatGraphQLError(action.payload)
            };
        case "CONTRIBUTIONPLAN_CONTRIBUTIONPLANBUNDLES_ERR":
            return {
                ...state,
                fetchingContributionPlanBundles: false,
                errorContributionPlanBundles: formatServerError(action.payload)
            };
        case "CONTRIBUTIONPLAN_MUTATION_REQ":
            return dispatchMutationReq(state, action);
        case "CONTRIBUTIONPLAN_MUTATION_ERR":
            return dispatchMutationErr(state, action);
        case "CONTRIBUTIONPLAN_CREATE_CONTRIBUTIONPLAN_RESP":
            return dispatchMutationResp(state, "createContributionPlan", action);
        case "CONTRIBUTIONPLAN_UPDATE_CONTRIBUTIONPLAN_RESP":
            return dispatchMutationResp(state, "updateContributionPlan", action);
        case "CONTRIBUTIONPLAN_DELETE_CONTRIBUTIONPLAN_RESP":
            return dispatchMutationResp(state, "deleteContributionPlan", action);
        case "CONTRIBUTIONPLAN_CREATE_CONTRIBUTIONPLANBUNDLE_RESP":
            return dispatchMutationResp(state, "createContributionPlanBundle", action);
        default:
            return state;
    }
}

export default reducer;
