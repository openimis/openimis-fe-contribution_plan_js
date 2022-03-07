import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
import {
    withModulesManager,
    formatMessageWithValues,
    formatDateFromISO,
    Searcher,
    PublishedComponent,
    coreConfirm,
    journalize,
    Contributions
} from "@openimis/fe-core";
import { fetchPaymentPlans } from "../actions";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import PaymentPlanFilter from "./PaymentPlanFilter";
import {
    ROWS_PER_PAGE_OPTIONS,
    DEFAULT_PAGE_SIZE,
    PAYMENTPLAN_CALCULATIONRULE_CONTRIBUTION_KEY
} from "../constants";

class PaymentPlanSearcher extends Component {
    constructor(props) {
        super(props);
    }

    fetch = params => this.props.fetchPaymentPlans(this.props.modulesManager, params);

    headers = () => {
        const { rights } = this.props;
        let result = [
            "paymentPlan.code",
            "paymentPlan.name",
            "paymentPlan.calculation",
            "paymentPlan.benefitPlan",
            "paymentPlan.periodicity",
            "paymentPlan.dateValidFrom",
            "paymentPlan.dateValidTo"
        ];
        return result;
    }

    itemFormatters = () => {
        const { intl, modulesManager } = this.props;
        let result = [
            paymentPlan => !!paymentPlan.code ? paymentPlan.code : "",
            paymentPlan => !!paymentPlan.name ? paymentPlan.name : "",
            paymentPlan => !!paymentPlan.calculation 
                ? <Contributions
                    contributionKey={PAYMENTPLAN_CALCULATIONRULE_CONTRIBUTION_KEY}
                    value={paymentPlan.calculation}
                    readOnly
                /> : "",
                paymentPlan => !!paymentPlan.benefitPlan
                ? <PublishedComponent
                    pubRef="product.ProductPicker"
                    withNull={true}
                    withLabel={false}
                    value={paymentPlan.benefitPlan}
                    readOnly
                /> : "",
            paymentPlan => !!paymentPlan.periodicity ? paymentPlan.periodicity : "",
            paymentPlan => !!paymentPlan.dateValidFrom
                ? formatDateFromISO(modulesManager, intl, paymentPlan.dateValidFrom)
                : "",
            paymentPlan => !!paymentPlan.dateValidTo
                ? formatDateFromISO(modulesManager, intl, paymentPlan.dateValidTo)
                : ""
        ];
        return result;
    }
    
    sorts = () => [
        ['code', true],
        ['name', true],
        ['calculation', true],
        ['benefitPlan', true],
        ['periodicity', true],
        ['dateValidFrom', true],
        ['dateValidTo', true]
    ];

    defaultFilters = () => {
        return {
            isDeleted: {
                value: false,
                filter: "isDeleted: false"
            },
            applyDefaultValidityFilter: {
                value: true,
                filter: "applyDefaultValidityFilter: true"
            }
        };
    }

    render() {
        const { intl, fetchingPaymentPlans, fetchedPaymentPlans, errorPaymentPlans,
            paymentPlans, paymentPlansPageInfo, paymentPlansTotalCount } = this.props;
        return (
            <Fragment>
                <Searcher
                    module="contributionPlan"
                    FilterPane={PaymentPlanFilter}
                    fetch={this.fetch}
                    items={paymentPlans}
                    itemsPageInfo={paymentPlansPageInfo}
                    fetchingItems={fetchingPaymentPlans}
                    fetchedItems={fetchedPaymentPlans}
                    errorItems={errorPaymentPlans}
                    tableTitle={formatMessageWithValues(intl, "contributionPlan", "paymentPlans.searcher.results.title", { paymentPlansTotalCount })}
                    headers={this.headers}
                    itemFormatters={this.itemFormatters}
                    sorts={this.sorts}
                    rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
                    defaultPageSize={DEFAULT_PAGE_SIZE}
                    defaultOrderBy="code"
                    defaultFilters={this.defaultFilters()}
                />
            </Fragment>
        )
    }
}

const mapStateToProps = state => ({
    fetchingPaymentPlans: state.contributionPlan.fetchingPaymentPlans,
    fetchedPaymentPlans: state.contributionPlan.fetchedPaymentPlans,
    errorPaymentPlans: state.contributionPlan.errorPaymentPlans,
    paymentPlans: state.contributionPlan.paymentPlans,
    paymentPlansPageInfo: state.contributionPlan.paymentPlansPageInfo,
    paymentPlansTotalCount: state.contributionPlan.paymentPlansTotalCount,
    confirmed: state.core.confirmed,
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ fetchPaymentPlans, coreConfirm, journalize }, dispatch);
};

export default withModulesManager(injectIntl(connect(mapStateToProps, mapDispatchToProps)(PaymentPlanSearcher)));
