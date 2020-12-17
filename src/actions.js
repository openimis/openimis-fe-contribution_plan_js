import {
    graphql, formatPageQueryWithCount
} from "@openimis/fe-core";

const CONTRIBUTIONPLAN_FULL_PROJECTION = (modulesManager) => [
    "id", "code", "name", "calculation{description}", 
    "benefitPlan" + modulesManager.getProjection("product.ProductPicker.projection"),
    "periodicity", "dateValidFrom", "dateValidTo"
];

export function fetchContributionPlans(modulesManager, params) {
    const payload = formatPageQueryWithCount(
        "contributionPlan",
        params,
        CONTRIBUTIONPLAN_FULL_PROJECTION(modulesManager)
    );
    return graphql(payload, "CONTRIBUTIONPLAN_CONTRIBUTIONPLANS");
}
