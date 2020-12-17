import React, { Component } from "react";
import { withModulesManager, formatMessage } from "@openimis/fe-core";
import { injectIntl } from "react-intl";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { RIGHT_CONTRIBUTION_PLAN_BUNDLE_SEARCH } from "../constants"
import ContributionPlanBundleSearcher from "../components/ContributionPlanBundleSearcher";

const styles = theme => ({
    page: theme.page,
    fab: theme.fab
})

class ContributionPlanBundlesPage extends Component {
    componentDidMount() {
        document.title = formatMessage(this.props.intl, "contributionPlan", "contributionPlanBundles.page.title");
    }

    render() {
        const { classes, rights } = this.props;
        return (
            !rights.includes(RIGHT_CONTRIBUTION_PLAN_BUNDLE_SEARCH) &&
                <div className={classes.page}>
                    <ContributionPlanBundleSearcher />
                </div>
        )
    }
}

const mapStateToProps = state => ({
    rights: !!state.core && !!state.core.user && !!state.core.user.i_user ? state.core.user.i_user.rights : []
});

export default withModulesManager(injectIntl(withTheme(withStyles(styles)(connect(mapStateToProps, null)(ContributionPlanBundlesPage)))));
