import React, { Component, Fragment } from "react"
import { injectIntl } from 'react-intl';
import { withModulesManager, formatMessageWithValues, formatDateFromISO, Searcher } from "@openimis/fe-core";
import { fetchContributionPlans } from "../actions"
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import ContributionPlanFilter from "./ContributionPlanFilter"
import { DATE_TO_DATETIME_SUFFIX } from "../constants"

class ContributionPlanSearcher extends Component {
    fetch = (params) => {
        this.props.fetchContributionPlans(this.props.modulesManager, params);
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
            prms.push(`dateValidFrom_Lte: "${formatDateFromISO(modulesManager, intl, currentDate)}${DATE_TO_DATETIME_SUFFIX}"`);
            prms.push(`dateValidTo_Gte: "${formatDateFromISO(modulesManager, intl, currentDate)}${DATE_TO_DATETIME_SUFFIX}"`);
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
            "contributionPlan.calculation",
            "contributionPlan.benefitPlan",
            "contributionPlan.periodicity",
            "contributionPlan.dateValidFrom",
            "contributionPlan.dateValidTo"
        ];
    }

    itemFormatters = () => {
        const { intl, modulesManager } = this.props;
        return [
            contributionPlan => !!contributionPlan.code ? contributionPlan.code : "",
            contributionPlan => !!contributionPlan.name ? contributionPlan.name : "",
            contributionPlan => !!contributionPlan.calculation ? contributionPlan.calculation.description : "",
            contributionPlan => !!contributionPlan.benefitPlan ? contributionPlan.benefitPlan.name : "",
            contributionPlan => !!contributionPlan.periodicity ? contributionPlan.periodicity : "",
            contributionPlan => !!contributionPlan.dateValidFrom
                ? formatDateFromISO(modulesManager, intl, contributionPlan.dateValidFrom)
                : "",
            contributionPlan => !!contributionPlan.dateValidTo
                ? formatDateFromISO(modulesManager, intl, contributionPlan.dateValidTo)
                : ""
        ];
    }

    sorts = () => {
        return [
            ['code', true],
            ['name', true],
            ['calculation', true],
            ['benefitPlan', true],
            ['periodicity', true],
            ['dateValidFrom', true],
            ['dateValidTo', true]
        ]
    }

    render() {
        const { intl, fetchingContributionPlans, fetchedContributionPlans, errorContributionPlans, 
            contributionPlans, contributionPlansPageInfo, contributionPlansTotalCount } = this.props;
        return (
            <Fragment>
                <Searcher
                    module="contributionPlan"
                    FilterPane={ContributionPlanFilter}
                    fetch={this.fetch}
                    items={contributionPlans}
                    itemsPageInfo={contributionPlansPageInfo}
                    fetchingItems={fetchingContributionPlans}
                    fetchedItems={fetchedContributionPlans}
                    errorItems={errorContributionPlans}
                    tableTitle={formatMessageWithValues(intl, "contributionPlan", "contributionPlans.searcher.results.title", { contributionPlansTotalCount })}
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
    fetchingContributionPlans: state.contributionPlan.fetchingContributionPlans,
    fetchedContributionPlans: state.contributionPlan.fetchedContributionPlans,
    errorContributionPlans: state.contributionPlan.errorContributionPlans,
    contributionPlans: state.contributionPlan.contributionPlans,
    contributionPlansPageInfo: state.contributionPlan.contributionPlansPageInfo,
    contributionPlansTotalCount: state.contributionPlan.contributionPlansTotalCount
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ fetchContributionPlans }, dispatch);
};

export default withModulesManager(injectIntl(connect(mapStateToProps, mapDispatchToProps)(ContributionPlanSearcher)));