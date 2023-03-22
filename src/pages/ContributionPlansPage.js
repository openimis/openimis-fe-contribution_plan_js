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
import { withTheme, withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import {
  RIGHT_CONTRIBUTION_PLAN_SEARCH,
  RIGHT_CONTRIBUTION_PLAN_CREATE,
  RIGHT_CONTRIBUTION_PLAN_UPDATE,
  MODULE_NAME,
} from "../constants";
import ContributionPlanSearcher from "../components/ContributionPlanSearcher";
import { Fab } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";

const styles = (theme) => ({
  page: theme.page,
  fab: theme.fab,
});

class ContributionPlansPage extends Component {
  onAdd = () =>
    historyPush(
      this.props.modulesManager,
      this.props.history,
      "contributionPlan.route.contributionPlan"
    );

  contributionPlanPageLink = (contributionPlan) =>
    `${this.props.modulesManager.getRef(
      "contributionPlan.route.contributionPlan"
    )}${"/" + decodeId(contributionPlan.id)}`;

  onDoubleClick = (contributionPlan, newTab = false) => {
    const { rights, modulesManager, history } = this.props;
    if (rights.includes(RIGHT_CONTRIBUTION_PLAN_UPDATE)) {
      historyPush(
        modulesManager,
        history,
        "contributionPlan.route.contributionPlan",
        [decodeId(contributionPlan.id)],
        newTab
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
    const { intl, classes, rights } = this.props;
    return (
      rights.includes(RIGHT_CONTRIBUTION_PLAN_SEARCH) && (
        <div className={classes.page}>
          <Helmet
            title={formatMessage(
              this.props.intl,
              "contributionPlan",
              "contributionPlans.page.title"
            )}
          />
          <ContributionPlanSearcher
            onDoubleClick={this.onDoubleClick}
            contributionPlanPageLink={this.contributionPlanPageLink}
            rights={rights}
          />
          {rights.includes(RIGHT_CONTRIBUTION_PLAN_CREATE) &&
            withTooltip(
              <div className={classes.fab}>
                <Fab color="primary" onClick={this.onAdd}>
                  <AddIcon />
                </Fab>
              </div>,
              formatMessage(
                intl,
                "contributionPlan",
                "contributionPlan.createButton.tooltip"
              )
            )}
        </div>
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

export default withModulesManager(
  injectIntl(
    withTheme(
      withStyles(styles)(
        connect(mapStateToProps, mapDispatchToProps)(ContributionPlansPage)
      )
    )
  )
);
