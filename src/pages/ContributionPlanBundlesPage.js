import React, { Component } from "react";
import { withModulesManager, formatMessage, withTooltip, historyPush } from "@openimis/fe-core";
import { injectIntl } from "react-intl";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { RIGHT_CONTRIBUTION_PLAN_BUNDLE_SEARCH, RIGHT_CONTRIBUTION_PLAN_BUNDLE_CREATE } from "../constants"
import ContributionPlanBundleSearcher from "../components/ContributionPlanBundleSearcher";
import { Fab } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";

const styles = theme => ({
    page: theme.page,
    fab: theme.fab
})

class ContributionPlanBundlesPage extends Component {
    componentDidMount() {
        document.title = formatMessage(this.props.intl, "contributionPlan", "contributionPlanBundles.page.title");
    }

    onAdd = () => historyPush(this.props.modulesManager, this.props.history, "contributionPlan.route.contributionPlanBundle");

    render() {
        const { intl, classes, rights } = this.props;
        return (
            rights.includes(RIGHT_CONTRIBUTION_PLAN_BUNDLE_SEARCH) &&
                <div className={classes.page}>
                    <ContributionPlanBundleSearcher />
                    {rights.includes(RIGHT_CONTRIBUTION_PLAN_BUNDLE_CREATE) && withTooltip(
                        <div className={classes.fab} >
                            <Fab color="primary" onClick={this.onAdd}>
                                <AddIcon />
                            </Fab>
                        </div>,
                        formatMessage(intl, "contributionPlan", "contributionPlanBundle.createButton.tooltip")
                    )}
                </div>
        )
    }
}

const mapStateToProps = state => ({
    rights: !!state.core && !!state.core.user && !!state.core.user.i_user ? state.core.user.i_user.rights : []
});

export default withModulesManager(injectIntl(withTheme(withStyles(styles)(connect(mapStateToProps, null)(ContributionPlanBundlesPage)))));
