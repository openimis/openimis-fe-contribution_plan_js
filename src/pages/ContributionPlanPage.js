import React, { Component } from "react"
import { withModulesManager, withHistory, historyPush, formatMessageWithValues } from "@openimis/fe-core";
import { injectIntl } from "react-intl";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { createContributionPlan } from "../actions"
import ContributionPlanForm from "../components/ContributionPlanForm"
import { RIGHT_CONTRIBUTION_PLAN_CREATE, RIGHT_CONTRIBUTION_PLAN_UPDATE } from "../constants"

const styles = theme => ({
    page: theme.page,
});

class ContributionPlanPage extends Component {
    back = () => {
        historyPush(this.props.modulesManager, this.props.history, "contributionPlan.route.contributionPlans")
    }

    save = contributionPlan => {
        this.props.createContributionPlan(
            contributionPlan,
            formatMessageWithValues(
                this.props.intl,
                "contributionPlan",
                "CreateContributionPlan.mutationLabel",
                { label: this.titleParams(contributionPlan).label }
            )
        );
    }

    titleParams = contributionPlan => ({ label: !!contributionPlan.name ? contributionPlan.name : null });

    render() {
        const { classes, rights } = this.props;
        return (
            rights.includes(RIGHT_CONTRIBUTION_PLAN_CREATE) && rights.includes(RIGHT_CONTRIBUTION_PLAN_UPDATE) && (
                <div className={classes.page}>
                    <ContributionPlanForm
                        back={this.back}
                        save={this.save}
                        titleParams={this.titleParams}
                    />
                </div>
            )
        )
    }
}

const mapStateToProps = state => ({
    rights: !!state.core && !!state.core.user && !!state.core.user.i_user ? state.core.user.i_user.rights : []
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ createContributionPlan }, dispatch);
};

export default withHistory(withModulesManager(injectIntl(withTheme(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(ContributionPlanPage))))));
