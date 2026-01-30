import React, { Component } from "react"
import { withModulesManager, withHistory, historyPush, formatMessageWithValues } from "@openimis/fe-core";
import { injectIntl } from "react-intl";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { styled } from "@mui/material/styles";
import { createPaymentPlan, updatePaymentPlan } from "../actions"
import PaymentPlanForm from "../components/PaymentPlanForm"
import { RIGHT_PAYMENT_PLAN_CREATE, RIGHT_PAYMENT_PLAN_UPDATE } from "../constants"

const StyledPage = styled('div')(({ theme }) => ({
  ...theme.page,
}));

class PaymentPlanPage extends Component {
    back = () => {
        historyPush(this.props.modulesManager, this.props.history, "contributionPlan.route.paymentPlans")
    }

    save = paymentPlan => {
        if (!!paymentPlan.id) {
            this.props.updatePaymentPlan(
                paymentPlan,
                formatMessageWithValues(
                    this.props.intl,
                    "paymentPlan",
                    "UpdatePaymentPlan.mutationLabel",
                    this.titleParams(paymentPlan)
                )
            );
        } else {
            this.props.createPaymentPlan(
                paymentPlan,
                formatMessageWithValues(
                    this.props.intl,
                    "paymentPlan",
                    "CreatePaymentPlan.mutationLabel",
                    this.titleParams(paymentPlan)
                )
            );
        }
    }

    titleParams = paymentPlan => ({ label: !!paymentPlan.name ? paymentPlan.name : null });

    render() {
        const { rights, paymentPlanId } = this.props;
        return (
            rights.includes(RIGHT_PAYMENT_PLAN_CREATE) && rights.includes(RIGHT_PAYMENT_PLAN_UPDATE) && (
                <StyledPage>
                    <PaymentPlanForm
                        paymentPlanId={paymentPlanId}
                        back={this.back}
                        save={this.save}
                        titleParams={this.titleParams}
                    />
                </StyledPage>
            )
        )
    }
}

const mapStateToProps = (state, props) => ({
    rights: !!state.core && !!state.core.user && !!state.core.user.i_user ? state.core.user.i_user.rights : [],
    paymentPlanId: props.match.params.paymentplan_id
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ createPaymentPlan, updatePaymentPlan }, dispatch);
};

export { StyledPage };
export default withHistory(withModulesManager(injectIntl(connect(mapStateToProps, mapDispatchToProps)(PaymentPlanPage))));
