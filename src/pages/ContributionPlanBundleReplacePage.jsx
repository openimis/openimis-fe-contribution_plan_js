import React, { Component } from "react"
import { withModulesManager, withHistory, historyPush, formatMessageWithValues } from "@openimis/fe-core";
import { injectIntl } from "react-intl";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { styled } from "@mui/material/styles";
import { replaceContributionPlanBundle } from "../actions"
import ContributionPlanBundleForm from "../components/ContributionPlanBundleForm"
import { RIGHT_CONTRIBUTION_PLAN_BUNDLE_REPLACE } from "../constants"

const StyledPage = styled('div')(({ theme }) => ({
  ...theme.page,
}));

class ContributionPlanBundlePage extends Component {
    back = () => {
        historyPush(this.props.modulesManager, this.props.history, "contributionPlan.route.contributionPlanBundles")
    }

    save = contributionPlanBundle => {
        this.props.replaceContributionPlanBundle(
            contributionPlanBundle,
            formatMessageWithValues(
                this.props.intl,
                "contributionPlan",
                "ReplaceContributionPlanBundle.mutationLabel",
                this.titleParams(contributionPlanBundle)
            )
        );
    }

    titleParams = contributionPlanBundle => ({ label: !!contributionPlanBundle.name ? contributionPlanBundle.name : null });

    render() {
        const { rights, contributionPlanBundleId } = this.props;
        return (
            rights.includes(RIGHT_CONTRIBUTION_PLAN_BUNDLE_REPLACE) && (
                <StyledPage>
                    <ContributionPlanBundleForm
                        contributionPlanBundleId={contributionPlanBundleId}
                        back={this.back}
                        save={this.save}
                        title="contributionPlanBundle.replacePage.title"
                        titleParams={this.titleParams}
                        isReplacing={true}
                    />
                </StyledPage>
            )
        )
    }
}

const mapStateToProps = (state, props) => ({
    rights: !!state.core && !!state.core.user && !!state.core.user.i_user ? state.core.user.i_user.rights : [],
    contributionPlanBundleId: props.match.params.contributionplanbundle_id
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ replaceContributionPlanBundle }, dispatch);
};

export default withHistory(withModulesManager(injectIntl(connect(mapStateToProps, mapDispatchToProps)(ContributionPlanBundlePage))));
