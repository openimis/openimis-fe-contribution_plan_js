import React, { Component } from "react";
import { bindActionCreators } from "redux";
import {
  withModulesManager,
  formatMessage,
  withTooltip,
  historyPush,
  decodeId,
  Helmet,
  clearCurrentPaginationPage,
} from "@openimis/fe-core";
import { injectIntl } from "react-intl";
import { styled } from "@mui/material/styles";
import { connect } from "react-redux";
import {
  RIGHT_PAYMENT_PLAN_SEARCH,
  RIGHT_PAYMENT_PLAN_CREATE,
  RIGHT_PAYMENT_PLAN_UPDATE,
  RIGHT_PAYMENT_PLAN_REPLACE,
  MODULE_NAME,
} from "../constants";
import PaymentPlanSearcher from "../components/PaymentPlanSearcher";
import { Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

const StyledPage = styled('div')(({ theme }) => ({
  ...theme.page,
  '& .fab': theme.fab,
}));

class PaymentPlansPage extends Component {
  onAdd = () =>
    historyPush(
      this.props.modulesManager,
      this.props.history,
      "contributionPlan.route.paymentPlan"
    );

  paymentPlanPageLink = (paymentPlan) =>
    `${this.props.modulesManager.getRef("contributionPlan.route.paymentPlan")}${
      "/" + decodeId(paymentPlan.id)
    }`;

  onDoubleClick = (paymentPlan, newTab = false) => {
    const { rights, modulesManager, history } = this.props;
    if (rights.includes(RIGHT_PAYMENT_PLAN_UPDATE)) {
      historyPush(
        modulesManager,
        history,
        "contributionPlan.route.paymentPlan",
        [decodeId(paymentPlan.id)],
        newTab
      );
    }
  };

  onReplace = (paymentPlan) => {
    const { rights, modulesManager, history } = this.props;
    if (rights.includes(RIGHT_PAYMENT_PLAN_REPLACE)) {
      historyPush(
        modulesManager,
        history,
        "contributionPlan.route.replacePaymentPlan",
        [decodeId(paymentPlan.id)]
      );
    }
  };

  componentDidMount = () => {
    const { module } = this.props;
    if (module !== MODULE_NAME) this.props.clearCurrentPaginationPage();
  };

  componentWillUnmount = () => {
    const { location, history } = this.props;
    const {
      location: { pathname },
    } = history;
    const urlPath = location.pathname;
    if (!pathname.includes(urlPath)) this.props.clearCurrentPaginationPage();
  };

  render() {
    const { intl, rights } = this.props;
    return (
      rights.includes(RIGHT_PAYMENT_PLAN_SEARCH) && (
        <StyledPage>
          <Helmet
            title={formatMessage(
              this.props.intl,
              "paymentPlan",
              "paymentPlans.page.title"
            )}
          />
          <PaymentPlanSearcher
            onDoubleClick={this.onDoubleClick}
            onReplace={this.onReplace}
            paymentPlanPageLink={this.paymentPlanPageLink}
            rights={rights}
          />
          {rights.includes(RIGHT_PAYMENT_PLAN_CREATE) &&
            withTooltip(
              <div className="fab">
                <Fab color="primary" onClick={this.onAdd}>
                  <AddIcon />
                </Fab>
              </div>,
              formatMessage(
                intl,
                "paymentPlan",
                "paymentPlan.createButton.tooltip"
              )
            )}
        </StyledPage>
      )
    );
  }
}

const mapStateToProps = (state) => ({
  rights:
    !!state.core && !!state.core.user && !!state.core.user.i_user
      ? state.core.user.i_user.rights
      : [],
  module: state.core?.savedPagination?.module,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({ clearCurrentPaginationPage }, dispatch);

export { StyledPage };
export { PaymentPlansPage };
export default withModulesManager(
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(PaymentPlansPage)
  )
);
