import React, { Component, Fragment } from "react";
import {
    Form,
    withModulesManager,
    withHistory,
    formatMessage,
    formatMessageWithValues,
    Helmet,
    journalize
} from "@openimis/fe-core";
import { injectIntl } from "react-intl";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import PaymentPlanHeadPanel from "./PaymentPlanHeadPanel";
import { fetchPaymentPlan } from "../actions";
import { MAX_PERIODICITY_VALUE, MIN_PERIODICITY_VALUE } from "../constants";

const styles = theme => ({
    paper: theme.paper.paper,
    paperHeader: theme.paper.header,
    paperHeaderAction: theme.paper.action,
    item: theme.paper.item,
});

class PaymentPlanForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            paymentPlan: {},
            jsonExtValid: true,
            requiredValid: false,
        };
    }

    componentDidMount() {
        if (!!this.props.paymentPlanId) {
            this.props.fetchPaymentPlan(this.props.modulesManager, this.props.paymentPlanId);
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.fetchedPaymentPlan !== this.props.fetchedPaymentPlan && !!this.props.fetchedPaymentPlan) {
            this.setState(
                (_, props) => ({ paymentPlan: props.paymentPlan })
            );
        }
        if (prevProps.submittingMutation && !this.props.submittingMutation) {
            this.props.journalize(this.props.mutation);
        }
    }

    isMandatoryFieldsEmpty = () => {
        const { paymentPlan } = this.state;
        if (
            !!paymentPlan.code &&
            !!paymentPlan.name &&
            !!paymentPlan.calculation &&
            !!paymentPlan.benefitPlan &&
            !!paymentPlan.periodicity &&
            !!paymentPlan.dateValidFrom
        ) {
            return false;
        }
        return true;
    }

    isPeriodicityValid = () => {
        let periodicityInt = parseInt(this.state.paymentPlan.periodicity);
        return !!periodicityInt ? periodicityInt >= MIN_PERIODICITY_VALUE && periodicityInt <= MAX_PERIODICITY_VALUE : false;
    }

    canSave = () => !this.isMandatoryFieldsEmpty() && this.isPeriodicityValid() && !!this.state.jsonExtValid && !!this.state.requiredValid;

    save = paymentPlan => this.props.save(paymentPlan);

    onEditedChanged = paymentPlan => this.setState({ paymentPlan })

    titleParams = () => this.props.titleParams(this.state.paymentPlan);

    setJsonExtValid = (valid) => this.setState({ jsonExtValid: !!valid });
    setRequiredValid = (valid) => this.setState({ requiredValid: !!valid });

    render() {
        const { intl, back, paymentPlanId, title, save, isReplacing = false } = this.props;
        return (
            <Fragment>
                <Helmet title={formatMessageWithValues(this.props.intl, "paymentPlan", "paymentPlan.page.title", this.titleParams())} />
                <Form
                    module="paymentPlan"
                    title="paymentPlan.page.title"
                    titleParams={this.titleParams()}
                    edited={this.state.paymentPlan}
                    back={back}
                    canSave={this.canSave}
                    save={this.save}
                    onEditedChanged={this.onEditedChanged}
                    HeadPanel={PaymentPlanHeadPanel}
                    mandatoryFieldsEmpty={this.isMandatoryFieldsEmpty()}
                    saveTooltip={formatMessage(intl, "paymentPlan", `saveButton.tooltip.${this.canSave() ? 'enabled' : 'disabled'}`)}
                    setJsonExtValid={this.setJsonExtValid}
                    setRequiredValid={this.setRequiredValid}
                    paymentPlanId={paymentPlanId}
                    isReplacing={isReplacing}
                    openDirty={save}
                />
            </Fragment>
        )
    }
}

const mapStateToProps = state => ({
    fetchingPaymentPlan: state.contributionPlan.fetchingPaymentPlan,
    fetchedPaymentPlan: state.contributionPlan.fetchedPaymentPlan,
    paymentPlan: state.contributionPlan.paymentPlan,
    errorPaymentPlan: state.contributionPlan.errorPaymentPlan,
    submittingMutation: state.contributionPlan.submittingMutation,
    mutation: state.contributionPlan.mutation
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ fetchPaymentPlan, journalize }, dispatch);
};

export default withHistory(withModulesManager(injectIntl(withTheme(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(PaymentPlanForm))))));
