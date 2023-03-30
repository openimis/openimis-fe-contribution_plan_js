import {
  formatServerError,
  formatGraphQLError,
  parseData,
  pageInfo,
  dispatchMutationReq,
  dispatchMutationResp,
  dispatchMutationErr,
} from "@openimis/fe-core";

function reducer(
  state = {
    fetchingContributionPlans: false,
    errorContributionPlans: null,
    fetchedContributionPlans: false,
    contributionPlans: [],
    contributionPlansPageInfo: {},
    contributionPlansTotalCount: 0,
    fetchingPickerContributionPlans: false,
    errorPickerContributionPlans: null,
    fetchedPickerContributionPlans: false,
    pickerContributionPlans: [],
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
    errorContributionPlanBundleContributionPlans: null,
    fetchingPaymentPlans: false,
    errorPaymentPlans: null,
    fetchedPaymentPlans: false,
    paymentPlans: [],
    paymentPlansPageInfo: {},
    paymentPlansTotalCount: 0,
    fetchingPickerPaymentPlans: false,
    errorPickerPaymentPlans: null,
    fetchedPickerPaymentPlans: false,
    pickerPaymentPlans: [],
    fetchingPaymentPlan: false,
    fetchedPaymentPlan: false,
    fetchingPaymentPlan: false,
    fetchedPaymentPlan: false,
    paymentPlan: {},
    errorPaymentPlan: null,
  },
  action
) {
  switch (action.type) {
    case "CONTRIBUTIONPLAN_CONTRIBUTIONPLANS_REQ":
      return {
        ...state,
        fetchingContributionPlans: true,
        fetchedContributionPlans: false,
        contributionPlans: [],
        contributionPlansPageInfo: {},
        contributionPlansTotalCount: 0,
        errorContributionPlans: null,
      };
    case "CONTRIBUTIONPLAN_CONTRIBUTIONPLANS_RESP":
      return {
        ...state,
        fetchingContributionPlans: false,
        fetchedContributionPlans: true,
        contributionPlans: parseData(action.payload.data.contributionPlan),
        contributionPlansPageInfo: pageInfo(
          action.payload.data.contributionPlan
        ),
        contributionPlansTotalCount: !!action.payload.data.contributionPlan
          ? action.payload.data.contributionPlan.totalCount
          : null,
        errorContributionPlans: formatGraphQLError(action.payload),
      };
    case "CONTRIBUTIONPLAN_CONTRIBUTIONPLANS_ERR":
      return {
        ...state,
        fetchingContributionPlans: false,
        errorContributionPlans: formatServerError(action.payload),
      };
    case "CONTRIBUTIONPLAN_PICKERCONTRIBUTIONPLANS_REQ":
      return {
        ...state,
        fetchingPickerContributionPlans: true,
        fetchedPickerContributionPlans: false,
        pickerContributionPlans: [],
        errorPickerContributionPlans: null,
      };
    case "CONTRIBUTIONPLAN_PICKERCONTRIBUTIONPLANS_RESP":
      return {
        ...state,
        fetchingPickerContributionPlans: false,
        fetchedPickerContributionPlans: true,
        pickerContributionPlans: parseData(
          action.payload.data.contributionPlan
        ),
        errorPickerContributionPlans: formatGraphQLError(action.payload),
      };
    case "CONTRIBUTIONPLAN_PICKERCONTRIBUTIONPLANS_ERR":
      return {
        ...state,
        fetchingPickerContributionPlans: false,
        errorPickerContributionPlans: formatServerError(action.payload),
      };
    case "CONTRIBUTIONPLAN_CONTRIBUTIONPLAN_REQ":
      return {
        ...state,
        fetchingContributionPlan: true,
        fetchedContributionPlan: false,
        contributionPlan: [],
        errorContributionPlan: null,
      };
    case "CONTRIBUTIONPLAN_CONTRIBUTIONPLAN_RESP":
      return {
        ...state,
        fetchingContributionPlan: false,
        fetchedContributionPlan: true,
        contributionPlan: parseData(action.payload.data.contributionPlan).find(
          (contributionPlan) => !!contributionPlan
        ),
        errorContributionPlan: formatGraphQLError(action.payload),
      };
    case "CONTRIBUTIONPLAN_CONTRIBUTIONPLAN_ERR":
      return {
        ...state,
        fetchingContributionPlan: false,
        errorContributionPlan: formatServerError(action.payload),
      };
    case "CONTRIBUTIONPLAN_CONTRIBUTIONPLAN_CLEAR":
      return {
        ...state,
        fetchingContributionPlan: true,
        fetchedContributionPlan: false,
        contributionPlan: {},
        errorContributionPlan: null,
      };
    case "CONTRIBUTIONPLAN_CONTRIBUTIONPLANBUNDLES_REQ":
      return {
        ...state,
        fetchingContributionPlanBundles: true,
        fetchedContributionPlanBundles: false,
        contributionPlanBundles: [],
        contributionPlanBundlesPageInfo: {},
        contributionPlanBundlesTotalCount: 0,
        errorContributionPlanBundles: null,
      };
    case "CONTRIBUTIONPLAN_CONTRIBUTIONPLANBUNDLES_RESP":
      return {
        ...state,
        fetchingContributionPlanBundles: false,
        fetchedContributionPlanBundles: true,
        contributionPlanBundles: parseData(
          action.payload.data.contributionPlanBundle
        ),
        contributionPlanBundlesPageInfo: pageInfo(
          action.payload.data.contributionPlanBundle
        ),
        contributionPlanBundlesTotalCount: !!action.payload.data
          .contributionPlanBundle
          ? action.payload.data.contributionPlanBundle.totalCount
          : null,
        errorContributionPlanBundles: formatGraphQLError(action.payload),
      };
    case "CONTRIBUTIONPLAN_CONTRIBUTIONPLANBUNDLES_ERR":
      return {
        ...state,
        fetchingContributionPlanBundles: false,
        errorContributionPlanBundles: formatServerError(action.payload),
      };
    case "CONTRIBUTIONPLAN_CONTRIBUTIONPLANBUNDLE_REQ":
      return {
        ...state,
        fetchingContributionPlanBundle: true,
        fetchedContributionPlanBundle: false,
        contributionPlanBundle: [],
        errorContributionPlanBundle: null,
      };
    case "CONTRIBUTIONPLAN_CONTRIBUTIONPLANBUNDLE_RESP":
      return {
        ...state,
        fetchingContributionPlanBundle: false,
        fetchedContributionPlanBundle: true,
        contributionPlanBundle: parseData(
          action.payload.data.contributionPlanBundle
        ).find((contributionPlanBundle) => !!contributionPlanBundle),
        errorContributionPlanBundle: formatGraphQLError(action.payload),
      };
    case "CONTRIBUTIONPLAN_CONTRIBUTIONPLANBUNDLE_ERR":
      return {
        ...state,
        fetchingContributionPlanBundle: false,
        errorContributionPlanBundle: formatServerError(action.payload),
      };
    case "CONTRIBUTIONPLAN_CONTRIBUTIONPLANBUNDLEDETAILS_REQ":
      return {
        ...state,
        fetchingContributionPlanBundleContributionPlans: true,
        fetchedContributionPlanBundleContributionPlans: false,
        contributionPlanBundleContributionPlans: [],
        contributionPlanBundleContributionPlansPageInfo: {},
        contributionPlanBundleContributionPlansTotalCount: 0,
        errorContributionPlanBundleContributionPlans: null,
      };
    case "CONTRIBUTIONPLAN_CONTRIBUTIONPLANBUNDLEDETAILS_RESP":
      return {
        ...state,
        fetchingContributionPlanBundleContributionPlans: false,
        fetchedContributionPlanBundleContributionPlans: true,
        contributionPlanBundleContributionPlans: parseData(
          action.payload.data.contributionPlanBundleDetails
        ),
        contributionPlanBundleContributionPlansPageInfo: pageInfo(
          action.payload.data.contributionPlanBundleDetails
        ),
        contributionPlanBundleContributionPlansTotalCount: !!action.payload.data
          .contributionPlanBundleDetails
          ? action.payload.data.contributionPlanBundleDetails.totalCount
          : null,
        errorContributionPlanBundleContributionPlans: formatGraphQLError(
          action.payload
        ),
      };
    case "CONTRIBUTIONPLAN_CONTRIBUTIONPLANBUNDLEDETAILS_ERR":
      return {
        ...state,
        fetchingContributionPlanBundleContributionPlans: false,
        errorContributionPlanBundleContributionPlans: formatServerError(
          action.payload
        ),
      };
    case "CONTRIBUTIONPLAN_PAYMENTPLANS_REQ":
      return {
        ...state,
        fetchingPaymentPlans: true,
        fetchedPaymentPlans: false,
        paymentPlans: [],
        paymentPlansPageInfo: {},
        paymentPlansTotalCount: 0,
        errorPaymentPlans: null,
      };
    case "CONTRIBUTIONPLAN_PAYMENTPLANS_RESP":
      return {
        ...state,
        fetchingPaymentPlans: false,
        fetchedPaymentPlans: true,
        paymentPlans: parseData(action.payload.data.paymentPlan),
        paymentPlansPageInfo: pageInfo(action.payload.data.paymentPlan),
        paymentPlansTotalCount: !!action.payload.data.paymentPlan
          ? action.payload.data.paymentPlan.totalCount
          : null,
        errorPaymentPlans: formatGraphQLError(action.payload),
      };
    case "CONTRIBUTIONPLAN_PAYMENTPLANS_ERR":
      return {
        ...state,
        fetchingPaymentPlans: false,
        errorPaymentPlans: formatServerError(action.payload),
      };
    case "CONTRIBUTIONPLAN_PAYMENTPLAN_REQ":
      return {
        ...state,
        fetchingPaymentPlan: true,
        fetchedPaymentPlan: false,
        paymentPlan: [],
        errorPaymentPlan: null,
      };
    case "CONTRIBUTIONPLAN_PAYMENTPLAN_RESP":
      return {
        ...state,
        fetchingPaymentPlan: false,
        fetchedPaymentPlan: true,
        paymentPlan: parseData(action.payload.data.paymentPlan).find(
          (paymentPlan) => !!paymentPlan
        ),
        errorPaymentPlan: formatGraphQLError(action.payload),
      };
    case "CONTRIBUTIONPLAN_PAYMENTPLAN_ERR":
      return {
        ...state,
        fetchingPaymentPlan: false,
        errorPaymentPlan: formatServerError(action.payload),
      };
    case "CONTRIBUTIONPLAN_PICKERPAYMENTPLANS_REQ":
      return {
        ...state,
        fetchingPickerPaymentPlans: true,
        fetchedPickerPaymentPlans: false,
        pickerPaymentPlans: [],
        errorPickerPaymentPlans: null,
      };
    case "CONTRIBUTIONPLAN_PICKERPAYMENTPLANS_RESP":
      return {
        ...state,
        fetchingPickerPaymentPlans: false,
        fetchedPickerPaymentPlans: true,
        pickerPaymentPlans: parseData(action.payload.data.paymentPlan),
        errorPickerPaymentPlans: formatGraphQLError(action.payload),
      };
    case "CONTRIBUTIONPLAN_PICKERPAYMENTPLANS_ERR":
      return {
        ...state,
        fetchingPickerPaymentPlans: false,
        errorPickerPaymentPlans: formatServerError(action.payload),
      };
    case "CONTRIBUTIONPLAN_CODE_FIELDS_VALIDATION_REQ":
      return {
        ...state,
        validationFields: {
          ...state.validationFields,
          contributionPlanCode: {
            isValidating: true,
            isValid: false,
            validationError: null,
          },
        },
      };
    case "CONTRIBUTIONPLAN_CODE_FIELDS_VALIDATION_RESP":
      return {
        ...state,
        validationFields: {
          ...state.validationFields,
          contributionPlanCode: {
            isValidating: false,
            isValid: action.payload?.data?.validateContributionPlanCode,
            validationError: formatGraphQLError(action.payload),
          },
        },
      };
    case "CONTRIBUTIONPLAN_CODE_FIELDS_VALIDATION_ERR":
      return {
        ...state,
        validationFields: {
          ...state.validationFields,
          contributionPlanCode: {
            isValidating: false,
            isValid: false,
            validationError: formatServerError(action.payload),
          },
        },
      };
    case "CONTRIBUTIONPLAN_CODE_FIELDS_VALIDATION_CLEAR":
      return {
        ...state,
        validationFields: {
          ...state.validationFields,
          contributionPlanCode: {
            isValidating: true,
            isValid: false,
            validationError: null,
          },
        },
      };
    case "CONTRIBUTIONPLAN_CODE_FIELDS_VALIDATION_SET_VALID":
      return {
        ...state,
        validationFields: {
          ...state.validationFields,
          contributionPlanCode: {
            isValidating: false,
            isValid: true,
            validationError: null,
          },
        },
      };

      case "PAYMENTPLAN_CODE_FIELDS_VALIDATION_REQ":
        return {
          ...state,
          validationFields: {
            ...state.validationFields,
            paymentPlanCode: {
              isValidating: true,
              isValid: false,
              validationError: null,
            },
          },
        };
      case "PAYMENTPLAN_CODE_FIELDS_VALIDATION_RESP":
        return {
          ...state,
          validationFields: {
            ...state.validationFields,
            paymentPlanCode: {
              isValidating: false,
              isValid: action.payload?.data?.validatePaymentPlanCode,
              validationError: formatGraphQLError(action.payload),
            },
          },
        };
      case "PAYMENTPLAN_CODE_FIELDS_VALIDATION_ERR":
        return {
          ...state,
          validationFields: {
            ...state.validationFields,
            paymentPlanCode: {
              isValidating: false,
              isValid: false,
              validationError: formatServerError(action.payload),
            },
          },
        };
      case "PAYMENTPLAN_CODE_FIELDS_VALIDATION_CLEAR":
        return {
          ...state,
          validationFields: {
            ...state.validationFields,
            paymentPlanCode: {
              isValidating: true,
              isValid: false,
              validationError: null,
            },
          },
        };
      case "PAYMENTPLAN_CODE_FIELDS_VALIDATION_SET_VALID":
        return {
          ...state,
          validationFields: {
            ...state.validationFields,
            paymentPlanCode: {
              isValidating: false,
              isValid: true,
              validationError: null,
            },
          },
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
      return dispatchMutationResp(
        state,
        "createContributionPlanBundle",
        action
      );
    case "CONTRIBUTIONPLAN_UPDATE_CONTRIBUTIONPLANBUNDLE_RESP":
      return dispatchMutationResp(
        state,
        "updateContributionPlanBundle",
        action
      );
    case "CONTRIBUTIONPLAN_DELETE_CONTRIBUTIONPLANBUNDLE_RESP":
      return dispatchMutationResp(
        state,
        "deleteContributionPlanBundle",
        action
      );
    case "CONTRIBUTIONPLAN_REPLACE_CONTRIBUTIONPLANBUNDLE_RESP":
      return dispatchMutationResp(
        state,
        "replaceContributionPlanBundle",
        action
      );
    case "CONTRIBUTIONPLAN_CREATE_CONTRIBUTIONPLANBUNDLEDETAILS_RESP":
      return dispatchMutationResp(
        state,
        "createContributionPlanBundleDetails",
        action
      );
    case "CONTRIBUTIONPLAN_UPDATE_CONTRIBUTIONPLANBUNDLEDETAILS_RESP":
      return dispatchMutationResp(
        state,
        "updateContributionPlanBundleDetails",
        action
      );
    case "CONTRIBUTIONPLAN_DELETE_CONTRIBUTIONPLANBUNDLEDETAILS_RESP":
      return dispatchMutationResp(
        state,
        "deleteContributionPlanBundleDetails",
        action
      );
    case "CONTRIBUTIONPLAN_REPLACE_CONTRIBUTIONPLANBUNDLEDETAILS_RESP":
      return dispatchMutationResp(
        state,
        "replaceContributionPlanBundleDetails",
        action
      );
    case "CONTRIBUTIONPLAN_CREATE_PAYMENTPLAN_RESP":
      return dispatchMutationResp(state, "createPaymentPlan", action);
    case "CONTRIBUTIONPLAN_UPDATE_PAYMENTPLAN_RESP":
      return dispatchMutationResp(state, "updatePaymentPlan", action);
    case "CONTRIBUTIONPLAN_REPLACE_PAYMENTPLAN_RESP":
      return dispatchMutationResp(state, "replacePaymentPlan", action);
    case "CONTRIBUTIONPLAN_DELETE_PAYMENTPLAN_RESP":
      return dispatchMutationResp(state, "deletePaymentPlan", action);
    default:
      return state;
  }
}

export default reducer;
