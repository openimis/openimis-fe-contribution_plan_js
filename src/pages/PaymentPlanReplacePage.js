import React, { Component } from "react"
import { withModulesManager, withHistory, historyPush, formatMessageWithValues } from "@openimis/fe-core";
import { injectIntl } from "react-intl";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { replacePaymentPlan } from "../actions"
import PaymentPlanForm from "../components/PaymentPlanForm"
import { RIGHT_PAYMENT_PLAN_REPLACE } from "../constants"

const styles = theme => ({
    page: theme.page,
});

class PaymentPlanPage extends Component {
    back = () => {
        historyPush(this.props.modulesManager, this.props.history, "contributionPlan.route.paymentPlans")
    }

    save = paymentPlan => {
        delete paymentPlan.code
        this.props.replacePaymentPlan(
            paymentPlan,
            formatMessageWithValues(
                this.props.intl,
                "paymentPlan",
                "ReplacePaymentPlan.mutationLabel",
                this.titleParams(paymentPlan)
            )
        );
    }

    titleParams = paymentPlan => ({ label: !!paymentPlan.name ? paymentPlan.name : null });

    render() {
        const { classes, rights, paymentPlanId } = this.props;
        return (
            rights.includes(RIGHT_PAYMENT_PLAN_REPLACE) && (
                <div className={classes.page}>
                    <PaymentPlanForm
                        paymentPlanId={paymentPlanId}
                        back={this.back}
                        save={this.save}
                        title="paymentPlanBundle.replacePage.title"
                        titleParams={this.titleParams}
                        isReplacing={true}
                    />
                </div>
            )
        )
    }
}

const mapStateToProps = (state, props) => ({
    rights: !!state.core && !!state.core.user && !!state.core.user.i_user ? state.core.user.i_user.rights : [],
    paymentPlanId: props.match.params.paymentplan_id
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ replacePaymentPlan }, dispatch);
};

export default withHistory(withModulesManager(injectIntl(withTheme(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(PaymentPlanPage))))));
