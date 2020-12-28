import React, { Component, Fragment } from "react"
import { injectIntl } from 'react-intl';
import { withModulesManager, formatMessageWithValues, formatDateFromISO, Searcher } from "@openimis/fe-core";
import { fetchContributionPlanBundles } from "../actions"
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import ContributionPlanBundleFilter from "./ContributionPlanBundleFilter"

class ContributionPlanBundleSearcher extends Component {
    fetch = (params) => {
        this.props.fetchContributionPlanBundles(params);
    }

    filtersToQueryParams = state => {
        const { intl, modulesManager } = this.props;
        let prms = Object.keys(state.filters)
            .filter(f => !!state.filters[f]['filter'])
            .map(f => state.filters[f]['filter']);
        prms.push(`first: ${state.pageSize}`);
        if (!state.filters.hasOwnProperty('isDeleted')) {
            prms.push("isDeleted: false");
        }
        if (!state.filters.hasOwnProperty('dateValidFrom')
            && !state.filters.hasOwnProperty('dateValidTo')) {
            let currentDate = new Date();
            prms.push(`dateValidFrom_Lte: "${formatDateFromISO(modulesManager, intl, currentDate)}T00:00:00"`);
            prms.push(`dateValidTo_Gte: "${formatDateFromISO(modulesManager, intl, currentDate)}T00:00:00"`);
        }
        if (!!state.afterCursor) {
            prms.push(`after: "${state.afterCursor}"`);
        }
        if (!!state.beforeCursor) {
            prms.push(`before: "${state.beforeCursor}"`);
        }
        if (!!state.orderBy) {
            prms.push(`orderBy: ["${state.orderBy}"]`);
        }
        return prms;
    }

    headers = () => {
        return [
            "contributionPlan.code",
            "contributionPlan.name",
            "contributionPlan.periodicity",
            "contributionPlan.dateValidFrom",
            "contributionPlan.dateValidTo"
        ];
    }

    itemFormatters = () => {
        const { intl, modulesManager } = this.props;
        return [
            contributionPlanBundle => !!contributionPlanBundle.code ? contributionPlanBundle.code : "",
            contributionPlanBundle => !!contributionPlanBundle.name ? contributionPlanBundle.name : "",
            contributionPlanBundle => !!contributionPlanBundle.periodicity ? contributionPlanBundle.periodicity : "",
            contributionPlanBundle => !!contributionPlanBundle.dateValidFrom
                ? formatDateFromISO(modulesManager, intl, contributionPlanBundle.dateValidFrom)
                : "",
                contributionPlanBundle => !!contributionPlanBundle.dateValidTo
                ? formatDateFromISO(modulesManager, intl, contributionPlanBundle.dateValidTo)
                : ""
        ];
    }

    sorts = () => {
        return [
            ['code', true],
            ['name', true],
            ['periodicity', true],
            ['dateValidFrom', true],
            ['dateValidTo', true]
        ]
    }

    render() {
        const { intl, fetchingContributionPlanBundles, fetchedContributionPlanBundles, errorContributionPlanBundles,
            contributionPlanBundles, contributionPlanBundlesPageInfo, contributionPlanBundlesTotalCount } = this.props;
        return (
            <Fragment>
                <Searcher
                    module="contributionPlan"
                    FilterPane={ContributionPlanBundleFilter}
                    fetch={this.fetch}
                    items={contributionPlanBundles}
                    itemsPageInfo={contributionPlanBundlesPageInfo}
                    fetchingItems={fetchingContributionPlanBundles}
                    fetchedItems={fetchedContributionPlanBundles}
                    errorItems={errorContributionPlanBundles}
                    tableTitle={formatMessageWithValues(intl, "contributionPlan", "contributionPlanBundles.searcher.results.title", { contributionPlanBundlesTotalCount })}
                    headers={this.headers}
                    itemFormatters={this.itemFormatters}
                    filtersToQueryParams={this.filtersToQueryParams}
                    sorts={this.sorts}
                    rowsPerPageOptions={[10, 20, 50, 100]}
                    defaultPageSize={10}
                    defaultOrderBy="code"
                />
            </Fragment>
        )
    }
}

const mapStateToProps = state => ({
    fetchingContributionPlanBundles: state.contributionPlan.fetchingContributionPlanBundles,
    fetchedContributionPlanBundles: state.contributionPlan.fetchedContributionPlanBundles,
    errorContributionPlanBundles: state.contributionPlan.errorContributionPlanBundles,
    contributionPlanBundles: state.contributionPlan.contributionPlanBundles,
    contributionPlanBundlesPageInfo: state.contributionPlan.contributionPlanBundlesPageInfo,
    contributionPlanBundlesTotalCount: state.contributionPlan.contributionPlanBundlesTotalCount
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ fetchContributionPlanBundles }, dispatch);
};

export default withModulesManager(injectIntl(connect(mapStateToProps, mapDispatchToProps)(ContributionPlanBundleSearcher)));