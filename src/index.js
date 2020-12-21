import messages_en from "./translations/en.json";
import reducer from "./reducer";
import ContributionPlansPage from "./pages/ContributionPlansPage";
import ContributionPlanPage from "./pages/ContributionPlanPage";

const ROUTE_CONTRIBUTION_PLANS = "contributionPlan/contributionPlans";
const ROUTE_CONTRIBUTION_PLAN = "contributionPlan/contributionPlan";

const DEFAULT_CONFIG = {
    "translations": [{ key: "en", messages: messages_en }],
    "reducers": [{ key: 'contributionPlan', reducer }],
    "refs": [
        { key: "contributionPlan.route.contributionPlans", ref: ROUTE_CONTRIBUTION_PLANS },
        { key: "contributionPlan.route.contributionPlan", ref: ROUTE_CONTRIBUTION_PLAN }
    ],
    "core.Router": [
        { path: ROUTE_CONTRIBUTION_PLANS, component: ContributionPlansPage },
        { path: ROUTE_CONTRIBUTION_PLAN, component: ContributionPlanPage }
    ]
}

export const ContributionPlanModule = (cfg) => {
    return { ...DEFAULT_CONFIG, ...cfg };
}
