import messages_en from "./translations/en.json";
import reducer from "./reducer";
import ContributionPlansPage from "./pages/ContributionPlansPage";
import ContributionPlanPage from "./pages/ContributionPlanPage";
import ContributionPlanBundlesPage from "./pages/ContributionPlanBundlesPage";
import ContributionPlanBundlePage from "./pages/ContributionPlanBundlePage";

const ROUTE_CONTRIBUTION_PLANS = "contributionPlans";
const ROUTE_CONTRIBUTION_PLAN = "contributionPlans/contributionPlan";
const ROUTE_CONTRIBUTION_PLAN_BUNDLES = "contributionPlanBundles";
const ROUTE_CONTRIBUTION_PLAN_BUNDLE = "contributionPlanBundles/contributionPlanBundle";

const DEFAULT_CONFIG = {
    "translations": [{ key: "en", messages: messages_en }],
    "reducers": [{ key: 'contributionPlan', reducer }],
    "refs": [
        { key: "contributionPlan.route.contributionPlans", ref: ROUTE_CONTRIBUTION_PLANS },
        { key: "contributionPlan.route.contributionPlan", ref: ROUTE_CONTRIBUTION_PLAN },
        { key: "contributionPlan.route.contributionPlanBundles", ref: ROUTE_CONTRIBUTION_PLAN_BUNDLES },
        { key: "contributionPlan.route.contributionPlanBundle", ref: ROUTE_CONTRIBUTION_PLAN_BUNDLE }
    ],
    "core.Router": [
        { path: ROUTE_CONTRIBUTION_PLANS, component: ContributionPlansPage },
        { path: ROUTE_CONTRIBUTION_PLAN  + "/:contributionplan_id?", component: ContributionPlanPage },
        { path: ROUTE_CONTRIBUTION_PLAN_BUNDLES, component: ContributionPlanBundlesPage },
        { path: ROUTE_CONTRIBUTION_PLAN_BUNDLE, component: ContributionPlanBundlePage }
    ]
}

export const ContributionPlanModule = (cfg) => {
    return { ...DEFAULT_CONFIG, ...cfg };
}
