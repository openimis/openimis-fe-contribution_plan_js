import React, { Component, Fragment } from "react"
import { injectIntl } from 'react-intl';
import { withModulesManager, formatMessage, formatMessageWithValues, formatDateFromISO, Searcher,
    PublishedComponent, decodeId, withTooltip, coreConfirm, journalize } from "@openimis/fe-core";
import { fetchContributionPlans, deleteContributionPlan } from "../actions"
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import ContributionPlanFilter from "./ContributionPlanFilter"
import { IconButton } from "@material-ui/core";
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { RIGHT_CONTRIBUTION_PLAN_UPDATE, RIGHT_CONTRIBUTION_PLAN_DELETE, DATE_TO_DATETIME_SUFFIX } from "../constants"

class ContributionPlanSearcher extends Component {
    constructor(props) {
        super(props);
        this.state = {
            toDelete: null,
            deleted: []
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.submittingMutation && !this.props.submittingMutation) {
            this.props.journalize(this.props.mutation);
            this.setState(state => ({ deleted: state.deleted.concat(state.toDelete) }));
        } else if (prevProps.confirmed !== this.props.confirmed && !!this.props.confirmed && !!this.state.confirmedAction) {
            this.state.confirmedAction();
        }
    }

    fetch = (params) => this.props.fetchContributionPlans(this.props.modulesManager, params);

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

    headers = () => {
        const { rights } = this.props;
        let result = [
            "contributionPlan.code",
            "contributionPlan.name",
            "contributionPlan.calculation",
            "contributionPlan.benefitPlan",
            "contributionPlan.periodicity",
            "contributionPlan.dateValidFrom",
            "contributionPlan.dateValidTo"
        ];
        if (rights.includes(RIGHT_CONTRIBUTION_PLAN_UPDATE)) {
            result.push("contributionPlan.emptyLabel");
        }
        if (rights.includes(RIGHT_CONTRIBUTION_PLAN_DELETE)) {
            result.push("contributionPlan.emptyLabel");
        }
        return result;
    }

    itemFormatters = () => {
        const { intl, modulesManager, rights, contributionPlanPageLink } = this.props;
        let result = [
            contributionPlan => !!contributionPlan.code ? contributionPlan.code : "",
            contributionPlan => !!contributionPlan.name ? contributionPlan.name : "",
            /**
             * Display calculation's ID until @see Calculation module provides a picker
             */
            contributionPlan => !!contributionPlan.calculation ? decodeId(contributionPlan.calculation.id) : "",
            contributionPlan => 
                <PublishedComponent
                    pubRef="product.ProductPicker"
                    withNull={true}
                    withLabel={false}
                    value={contributionPlan.benefitPlan}
                    readOnly
                />,
            contributionPlan => !!contributionPlan.periodicity ? contributionPlan.periodicity : "",
            contributionPlan => !!contributionPlan.dateValidFrom
                ? formatDateFromISO(modulesManager, intl, contributionPlan.dateValidFrom)
                : "",
            contributionPlan => !!contributionPlan.dateValidTo
                ? formatDateFromISO(modulesManager, intl, contributionPlan.dateValidTo)
                : ""
        ];
        if (rights.includes(RIGHT_CONTRIBUTION_PLAN_UPDATE)) {
            result.push(
                contributionPlan => withTooltip(
                    <IconButton
                        href={contributionPlanPageLink(contributionPlan)}
                        onClick={e => e.stopPropagation() && !contributionPlan.clientMutationId && onDoubleClick(contributionPlan)}
                        disabled={this.state.deleted.includes(contributionPlan.id)}>
                        <EditIcon />
                    </IconButton>,
                    formatMessage(intl, "contributionPlan", "editButton.tooltip")
                )
            );
        }
        if (rights.includes(RIGHT_CONTRIBUTION_PLAN_DELETE)) {
            result.push(
                contributionPlan => withTooltip(
                    <IconButton
                        onClick={() => this.onDelete(contributionPlan)}
                        disabled={this.state.deleted.includes(contributionPlan.id)}>
                        <DeleteIcon />
                    </IconButton>,
                    formatMessage(this.props.intl, "contributionPlan", "deleteButton.tooltip")
                )
            );
        }
        return result;
    }

    onDelete = contributionPlan => {
        const { intl, coreConfirm, deleteContributionPlan } = this.props;
        let confirm = () => coreConfirm(
            formatMessageWithValues(intl, "contributionPlan", "deleteContributionPlan.confirm.title", { label: contributionPlan.name }),
            formatMessageWithValues(intl, "contributionPlan", "deleteContributionPlan.confirm.message", { label: contributionPlan.name })
        );
        let confirmedAction = () => {
            deleteContributionPlan(
                contributionPlan,
                formatMessageWithValues(
                    intl,
                    "contributionPlan",
                    "DeleteContributionPlan.mutationLabel",
                    { label: contributionPlan.name }
                )
            );
            this.setState({ toDelete: contributionPlan.id });
        }
        this.setState(
            { confirmedAction },
            confirm
        )
    }

    rowDeleted = (_, contributionPlan) => this.state.deleted.includes(contributionPlan.id);

    sorts = () => [
        ['code', true],
        ['name', true],
        ['calculation', true],
        ['benefitPlan', true],
        ['periodicity', true],
        ['dateValidFrom', true],
        ['dateValidTo', true]
    ];

    render() {
        const { intl, fetchingContributionPlans, fetchedContributionPlans, errorContributionPlans,
            contributionPlans, contributionPlansPageInfo, contributionPlansTotalCount, onDoubleClick } = this.props;
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
                    onDoubleClick={contributionPlan => !contributionPlan.clientMutationId && onDoubleClick(contributionPlan)}
                    rowDisabled={this.rowDeleted}
                    rowLocked={this.rowDeleted}
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
    contributionPlansTotalCount: state.contributionPlan.contributionPlansTotalCount,
    confirmed: state.core.confirmed,
    submittingMutation: state.contributionPlan.submittingMutation,
    mutation: state.contributionPlan.mutation
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ fetchContributionPlans, coreConfirm, deleteContributionPlan, journalize }, dispatch);
};

export default withModulesManager(injectIntl(connect(mapStateToProps, mapDispatchToProps)(ContributionPlanSearcher)));