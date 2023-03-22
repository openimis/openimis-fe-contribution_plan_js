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
  RIGHT_CONTRIBUTION_PLAN_BUNDLE_SEARCH,
  RIGHT_CONTRIBUTION_PLAN_BUNDLE_CREATE,
  RIGHT_CONTRIBUTION_PLAN_BUNDLE_UPDATE,
  RIGHT_CONTRIBUTION_PLAN_BUNDLE_REPLACE,
  MODULE_NAME,
} from "../constants";
import ContributionPlanBundleSearcher from "../components/ContributionPlanBundleSearcher";
import { Fab } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";

const styles = (theme) => ({
  page: theme.page,
  fab: theme.fab,
});

class ContributionPlanBundlesPage extends Component {
  onAdd = () =>
    historyPush(
      this.props.modulesManager,
      this.props.history,
      "contributionPlan.route.contributionPlanBundle"
    );

  contributionPlanBundlePageLink = (contributionPlanBundle) =>
    `${this.props.modulesManager.getRef(
      "contributionPlan.route.contributionPlanBundle"
    )}${"/" + decodeId(contributionPlanBundle.id)}`;

  onDoubleClick = (contributionPlanBundle, newTab = false) => {
    const { rights, modulesManager, history } = this.props;
    if (rights.includes(RIGHT_CONTRIBUTION_PLAN_BUNDLE_UPDATE)) {
      historyPush(
        modulesManager,
        history,
        "contributionPlan.route.contributionPlanBundle",
        [decodeId(contributionPlanBundle.id)],
        newTab
      );
    }
  };

  onReplace = (contributionPlanBundle) => {
    const { rights, modulesManager, history } = this.props;
    if (rights.includes(RIGHT_CONTRIBUTION_PLAN_BUNDLE_REPLACE)) {
      historyPush(
        modulesManager,
        history,
        "contributionPlan.route.replaceContributionPlanBundle",
        [decodeId(contributionPlanBundle.id)]
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
      rights.includes(RIGHT_CONTRIBUTION_PLAN_BUNDLE_SEARCH) && (
        <div className={classes.page}>
          <Helmet
            title={formatMessage(
              this.props.intl,
              "contributionPlan",
              "contributionPlanBundles.page.title"
            )}
          />
          <ContributionPlanBundleSearcher
            onDoubleClick={this.onDoubleClick}
            onReplace={this.onReplace}
            contributionPlanBundlePageLink={this.contributionPlanBundlePageLink}
            rights={rights}
          />
          {rights.includes(RIGHT_CONTRIBUTION_PLAN_BUNDLE_CREATE) &&
            withTooltip(
              <div className={classes.fab}>
                <Fab color="primary" onClick={this.onAdd}>
                  <AddIcon />
                </Fab>
              </div>,
              formatMessage(
                intl,
                "contributionPlan",
                "contributionPlanBundle.createButton.tooltip"
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
        connect(
          mapStateToProps,
          mapDispatchToProps
        )(ContributionPlanBundlesPage)
      )
    )
  )
);
