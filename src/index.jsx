import React from "react";
import messages_en from "./translations/en.json";
import reducer from "./reducer";
import { GetIconComponent } from "@openimis/fe-core";
const LocalOffer = GetIconComponent("LocalOffer")
const Folder = GetIconComponent("Folder")
import ContributionPlansPage from "./pages/ContributionPlansPage";
import ContributionPlanPage from "./pages/ContributionPlanPage";
import ContributionPlanBundlesPage from "./pages/ContributionPlanBundlesPage";
import ContributionPlanBundlePage from "./pages/ContributionPlanBundlePage";
import ContributionPlanBundleReplacePage from "./pages/ContributionPlanBundleReplacePage";
import ContributionPlanBundlePicker from "./pickers/ContributionPlanBundlePicker";
import ContributionPlanPicker from "./pickers/ContributionPlanPicker";
import PaymentPlansPage from "./pages/PaymentPlansPage";
import PaymentPlanPage from "./pages/PaymentPlanPage";
import PaymentPlanReplacePage from "./pages/PaymentPlanReplacePage";
import PaymentPlanPicker from "./pickers/PaymentPlanPicker";
import {
    RIGHT_CONTRIBUTION_PLAN_BUNDLE_SEARCH,
    RIGHT_CONTRIBUTION_PLAN_SEARCH, 
    RIGHT_PAYMENT_PLAN_SEARCH
} from "./constants";
import { FormattedMessage } from "@openimis/fe-core";

const ROUTE_CONTRIBUTION_PLANS = "contributionPlans";
const ROUTE_CONTRIBUTION_PLAN = "contributionPlans/contributionPlan";
const ROUTE_CONTRIBUTION_PLAN_BUNDLES = "contributionPlanBundles";
const ROUTE_CONTRIBUTION_PLAN_BUNDLE = "contributionPlanBundles/contributionPlanBundle";
const ROUTE_CONTRIBUTION_PLAN_BUNDLE_REPLACE = "contributionPlanBundles/replaceContributionPlanBundle";
const ROUTE_PAYMENT_PLANS = "paymentPlans";
const ROUTE_PAYMENT_PLAN = "paymentPlans/paymentPlan";
const ROUTE_PAYMENT_PLAN_REPLACE = "paymentPlans/replacePaymentPlan";

const DEFAULT_CONFIG = {
    "translations": [{ key: "en", messages: messages_en }],
    "reducers": [{ key: 'contributionPlan', reducer }],
    "refs": [
        { key: "contributionPlan.route.contributionPlans", ref: ROUTE_CONTRIBUTION_PLANS },
        { key: "contributionPlan.route.contributionPlan", ref: ROUTE_CONTRIBUTION_PLAN },
        { key: "contributionPlan.route.contributionPlanBundles", ref: ROUTE_CONTRIBUTION_PLAN_BUNDLES },
        { key: "contributionPlan.route.contributionPlanBundle", ref: ROUTE_CONTRIBUTION_PLAN_BUNDLE },
        { key: "contributionPlan.route.replaceContributionPlanBundle", ref: ROUTE_CONTRIBUTION_PLAN_BUNDLE_REPLACE },
        { key: "contributionPlan.ContributionPlanBundlePicker", ref: ContributionPlanBundlePicker },
        { key: "contributionPlan.ContributionPlanBundlePicker.projection", ref: ["id", "code", "name", "periodicity", "dateValidFrom", "dateValidTo", "isDeleted", "replacementUuid"] },
        { key: "contributionPlan.ContributionPlanPicker", ref: ContributionPlanPicker },
        { key: "contributionPlan.ContributionPlanPicker.projection", ref: ["id", "code", "name"] },
        { key: "contributionPlan.route.paymentPlans", ref: ROUTE_PAYMENT_PLANS },
        { key: "contributionPlan.route.paymentPlan", ref: ROUTE_PAYMENT_PLAN },
        { key: "contributionPlan.PaymentPlanPicker", ref: PaymentPlanPicker },
        { key: "contributionPlan.PaymentPlanPicker.projection", ref: ["id", "code", "name", "periodicity", "dateValidFrom", "dateValidTo", "isDeleted", "replacementUuid", "benefitPlan"] },
        { key: "contributionPlan.route.replacePaymentPlan", ref: ROUTE_PAYMENT_PLAN_REPLACE },
    ],
    "core.Router": [
        { path: ROUTE_CONTRIBUTION_PLANS, text: "contributionPlan.contributionPlans.page.title", id: 'admin.contributionPlans',component: ContributionPlansPage, rights: [RIGHT_CONTRIBUTION_PLAN_SEARCH], icon: "LocalOffer" },
        { path: ROUTE_CONTRIBUTION_PLAN  + "/:contributionplan_id?", component: ContributionPlanPage, rights: [RIGHT_CONTRIBUTION_PLAN_SEARCH], icon: "LocalOffer" },
        { path: ROUTE_CONTRIBUTION_PLAN_BUNDLES, text: "contributionPlan.contributionPlanBundles.page.title", id: 'admin.contributionPlanBundles', component: ContributionPlanBundlesPage, rights: [RIGHT_CONTRIBUTION_PLAN_BUNDLE_SEARCH], icon: "Folder" },
        { path: ROUTE_CONTRIBUTION_PLAN_BUNDLE  + "/:contributionplanbundle_id?", component: ContributionPlanBundlePage, rights: [RIGHT_CONTRIBUTION_PLAN_BUNDLE_SEARCH], icon: "Folder" },
        { path: ROUTE_CONTRIBUTION_PLAN_BUNDLE_REPLACE  + "/:contributionplanbundle_id", component: ContributionPlanBundleReplacePage, rights: [RIGHT_CONTRIBUTION_PLAN_BUNDLE_SEARCH], icon: "Folder" },
        { path: ROUTE_PAYMENT_PLANS, text: "contributionPlan.paymentPlans.page.title", id: 'legalAndFinance.paymentPlans', component: PaymentPlansPage, rights: [RIGHT_PAYMENT_PLAN_SEARCH], icon: "LocalOffer" },
        { path: ROUTE_PAYMENT_PLAN  + "/:paymentplan_id?", component: PaymentPlanPage, rights: [RIGHT_PAYMENT_PLAN_SEARCH], icon: "LocalOffer" },
        { path: ROUTE_PAYMENT_PLAN_REPLACE  + "/:paymentplan_id", component: PaymentPlanReplacePage, rights: [RIGHT_PAYMENT_PLAN_SEARCH], icon: "LocalOffer" },
    ],
    "admin.MainMenu": [
        {
            route:  ROUTE_CONTRIBUTION_PLANS,
        },
        {
            route:  ROUTE_CONTRIBUTION_PLAN_BUNDLES,
        },
    ],
    "invoice.MainMenu": [
        {
            route:  ROUTE_PAYMENT_PLANS,
        }
    ]
}

export const ContributionPlanModule = (cfg) => {
    return { ...DEFAULT_CONFIG, ...cfg };
}
