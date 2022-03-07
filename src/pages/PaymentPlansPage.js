import React from "react";
import { withModulesManager, formatMessage, Helmet } from "@openimis/fe-core";
import { injectIntl } from "react-intl";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { RIGHT_PAYMENT_PLAN_SEARCH } from "../constants"
import PaymentPlanSearcher from "../components/PaymentPlanSearcher";

const styles = theme => ({
    page: theme.page,
    fab: theme.fab
})

const PaymentPlansPage = ({ intl, classes, rights }) =>
  rights.includes(RIGHT_PAYMENT_PLAN_SEARCH) && (
    <div className={classes.page}>
      <Helmet title={formatMessage(intl, "invoice", "invoices.pageTitle")} />
      <PaymentPlanSearcher rights={rights} />
    </div>
  );

const mapStateToProps = state => ({
    rights: !!state.core && !!state.core.user && !!state.core.user.i_user ? state.core.user.i_user.rights : []
});

export default withModulesManager(
    injectIntl(withTheme(withStyles(styles)(connect(mapStateToProps)(PaymentPlansPage)))),
  );
