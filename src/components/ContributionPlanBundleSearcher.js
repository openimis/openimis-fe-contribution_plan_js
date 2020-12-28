import React, { Component, Fragment } from "react"
import { injectIntl } from 'react-intl';
import { withModulesManager, formatMessageWithValues, formatDateFromISO, Searcher } from "@openimis/fe-core";
import { fetchContributionPlanBundles } from "../actions"
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import ContributionPlanBundleFilter from "./ContributionPlanBundleFilter"
import { DATE_TO_DATETIME_SUFFIX } from "../constants"

class ContributionPlanBundleSearcher extends Component {
    fetch = (params) => {
        this.props.fetchContributionPlanBundles(params);
    }

    filtersToQueryParams = state => {
        const { intl, modulesManager } = this.props;
        let params = Object.keys(state.filters)
            .filter(f => !!state.filters[f]['filter'])
            .map(f => state.filters[f]['filter']);
        params.push(`first: ${state.pageSize}`);
        if (!state.filters.hasOwnProperty('isDeleted')) {
            params.push("isDeleted: false");
        }
        if (!state.filters.hasOwnProperty('dateValidTo')) {
            let dateValidAt = formatDateFromISO(modulesManager, intl, new Date());
            if (state.filters.hasOwnProperty('dateValidFrom')) {
                /**
                 * If @see dateValidTo is not set but @see dateValidFrom is set,
                 * then all @see ContributionPlan valid at @see dateValidFrom are shown.
                 * Default filter on @see dateValidFrom has to be removed from query params. 
                 */
                dateValidAt = state.filters['dateValidFrom']['value'];
                params = params.filter(f => !f.startsWith('dateValidFrom'));
            }
            params.push(`dateValidFrom_Lte: "${dateValidAt}${DATE_TO_DATETIME_SUFFIX}"`);
            params.push(`dateValidTo_Gte: "${dateValidAt}${DATE_TO_DATETIME_SUFFIX}"`);
        }
        if (!!state.afterCursor) {
            params.push(`after: "${state.afterCursor}"`);
        }
        if (!!state.beforeCursor) {
            params.push(`before: "${state.beforeCursor}"`);
        }
        if (!!state.orderBy) {
            params.push(`orderBy: ["${state.orderBy}"]`);
        }
        return params;
    }

    headers = () => [
        "contributionPlan.code",
        "contributionPlan.name",
        "contributionPlan.periodicity",
        "contributionPlan.dateValidFrom",
        "contributionPlan.dateValidTo"
    ];

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

    sorts = () => [
        ['code', true],
        ['name', true],
        ['periodicity', true],
        ['dateValidFrom', true],
        ['dateValidTo', true]
    ];

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