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
        fetchingContributionPlanBundle: false,
        fetchedContributionPlanBundle: false,
        contributionPlanBundle: {},
        errorContributionPlanBundle: null,
        fetchingContributionPlanBundleContributionPlans: false,
        fetchedContributionPlanBundleContributionPlans: false,
        contributionPlanBundleContributionPlans: [],
        contributionPlanBundleContributionPlansPageInfo: {},
        contributionPlanBundleContributionPlansTotalCount: 0,
        errorContributionPlanBundleContributionPlans: null
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
        case "CONTRIBUTIONPLAN_CONTRIBUTIONPLANBUNDLE_REQ":
            return {
                ...state,
                fetchingContributionPlanBundle: true,
                fetchedContributionPlanBundle: false,
                contributionPlanBundle: [],
                errorContributionPlanBundle: null
            };
        case "CONTRIBUTIONPLAN_CONTRIBUTIONPLANBUNDLE_RESP":
            return {
                ...state,
                fetchingContributionPlanBundle: false,
                fetchedContributionPlanBundle: true,
                contributionPlanBundle: parseData(action.payload.data.contributionPlanBundle).find(contributionPlanBundle => !!contributionPlanBundle),
                errorContributionPlanBundle: formatGraphQLError(action.payload)
            };
        case "CONTRIBUTIONPLAN_CONTRIBUTIONPLANBUNDLE_ERR":
            return {
                ...state,
                fetchingContributionPlanBundle: false,
                errorContributionPlanBundle: formatServerError(action.payload)
            };
        case "CONTRIBUTIONPLAN_CONTRIBUTIONPLANBUNDLEDETAILS_REQ":
            return {
                ...state,
                fetchingContributionPlanBundleContributionPlans: true,
                fetchedContributionPlanBundleContributionPlans: false,
                contributionPlanBundleContributionPlans: [],
                contributionPlanBundleContributionPlansPageInfo: {},
                contributionPlanBundleContributionPlansTotalCount: 0,
                errorContributionPlanBundleContributionPlans: null
            };
        case "CONTRIBUTIONPLAN_CONTRIBUTIONPLANBUNDLEDETAILS_RESP":
            return {
                ...state,
                fetchingContributionPlanBundleContributionPlans: false,
                fetchedContributionPlanBundleContributionPlans: true,
                contributionPlanBundleContributionPlans: parseData(action.payload.data.contributionPlanBundleDetails),
                contributionPlanBundleContributionPlansPageInfo: pageInfo(action.payload.data.contributionPlanBundleDetails),
                contributionPlanBundleContributionPlansTotalCount: !!action.payload.data.contributionPlanBundleDetails ? action.payload.data.contributionPlanBundleDetails.totalCount : null,
                errorContributionPlanBundleContributionPlans: formatGraphQLError(action.payload)
            };
        case "CONTRIBUTIONPLAN_CONTRIBUTIONPLANBUNDLEDETAILS_ERR":
            return {
                ...state,
                fetchingContributionPlanBundleContributionPlans: false,
                errorContributionPlanBundleContributionPlans: formatServerError(action.payload)
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
        case "CONTRIBUTIONPLAN_UPDATE_CONTRIBUTIONPLANBUNDLE_RESP":
            return dispatchMutationResp(state, "updateContributionPlanBundle", action);
        case "CONTRIBUTIONPLAN_DELETE_CONTRIBUTIONPLANBUNDLE_RESP":
            return dispatchMutationResp(state, "deleteContributionPlanBundle", action);
        case "CONTRIBUTIONPLAN_REPLACE_CONTRIBUTIONPLANBUNDLE_RESP":
            return dispatchMutationResp(state, "replaceContributionPlanBundle", action);
        case "CONTRIBUTIONPLAN_CREATE_CONTRIBUTIONPLANBUNDLEDETAILS_RESP":
            return dispatchMutationResp(state, "createContributionPlanBundleDetails", action);
        case "CONTRIBUTIONPLAN_UPDATE_CONTRIBUTIONPLANBUNDLEDETAILS_RESP":
            return dispatchMutationResp(state, "updateContributionPlanBundleDetails", action);
        case "CONTRIBUTIONPLAN_DELETE_CONTRIBUTIONPLANBUNDLEDETAILS_RESP":
            return dispatchMutationResp(state, "deleteContributionPlanBundleDetails", action);
        default:
            return state;
    }
}

export default reducer;
