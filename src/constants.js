export const RIGHT_CONTRIBUTION_PLAN_BUNDLE_SEARCH = 151101
export const RIGHT_CONTRIBUTION_PLAN_BUNDLE_CREATE = 151102
export const RIGHT_CONTRIBUTION_PLAN_BUNDLE_UPDATE = 151103
export const RIGHT_CONTRIBUTION_PLAN_BUNDLE_DELETE = 151104
export const RIGHT_CONTRIBUTION_PLAN_BUNDLE_REPLACE = 151106
export const RIGHT_CONTRIBUTION_PLAN_SEARCH = 151201
export const RIGHT_CONTRIBUTION_PLAN_CREATE = 151202
export const RIGHT_CONTRIBUTION_PLAN_UPDATE = 151203
export const RIGHT_CONTRIBUTION_PLAN_DELETE = 151204
export const RIGHT_CONTRIBUTION_PLAN_REPLACE = 151206
export const DATE_TO_DATETIME_SUFFIX = "T00:00:00"
export const GREATER_OR_EQUAL_LOOKUP = "Gte"
export const LESS_OR_EQUAL_LOOKUP = "Lte"
export const CONTAINS_LOOKUP = "Icontains"
export const EMPTY_PERIODICITY_VALUE = 0
export const MIN_PERIODICITY_VALUE = 1
export const MAX_PERIODICITY_VALUE = 12
export const DEFAULT_PAGE_SIZE = 10
export const ROWS_PER_PAGE_OPTIONS = [10, 20, 50, 100]
export const CONTRIBUTIONPLAN_CALCULATION_CONTRIBUTION_KEY = "contributionPlan.ContributionPlan.calculation"
export const CONTRIBUTIONPLAN_CALCULATIONRULE_CONTRIBUTION_KEY = "contributionPlan.ContributionPlan.calculationRule"
export const CONTRIBUTIONPLAN_CLASSNAME = "ContributionPlan"
export const PAYMENTPLAN_CLASSNAME = "PaymentPlan"
export const RIGHT_CALCULATION_WRITE = "write"
export const RIGHT_CALCULATION_UPDATE = "update"
export const RIGHT_PAYMENT_PLAN_SEARCH = 157101
export const RIGHT_PAYMENT_PLAN_CREATE = 157102
export const RIGHT_PAYMENT_PLAN_UPDATE = 157103
export const RIGHT_PAYMENT_PLAN_DELETE = 157104
export const RIGHT_PAYMENT_PLAN_REPLACE = 157106
export const MODULE_NAME = "contributionPlan";

export const PAYMENT_PLAN_TYPE = {
    PRODUCT: 'product',
    BENEFIT_PLAN: 'benefitplan'
}

export const PAYMENT_PLAN_TYPE_LIST = [PAYMENT_PLAN_TYPE.PRODUCT, PAYMENT_PLAN_TYPE.BENEFIT_PLAN]
export const EMPTY_STRING = " "

export const CLEARED_STATE_FILTER = { field: "", filter: "", type: "", value: "" }
export const BENEFIT_PLAN = "BenefitPlan";
export const INTEGER = "integer";
export const STRING = "string";
export const BOOLEAN = "boolean";
export const DATE = "date";
export const BOOL_OPTIONS = [
  { value: "True", label: "True" },
  { value: "False", label: "False" },
];