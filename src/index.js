import messages_en from "./translations/en.json";
import reducer from "./reducer";
import ContributionPlansPage from "./pages/ContributionPlansPage";

const ROUTE_CONTRIBUTION_PLANS = "contributionPlan/contributionPlans";

const DEFAULT_CONFIG = {
    "translations": [{ key: "en", messages: messages_en }],
    "reducers": [{ key: 'contributionPlan', reducer }],
    "core.Router": [
        { path: ROUTE_CONTRIBUTION_PLANS, component: ContributionPlansPage },
    ]
}

export const ContributionPlanModule = (cfg) => {
    return { ...DEFAULT_CONFIG, ...cfg };
}
