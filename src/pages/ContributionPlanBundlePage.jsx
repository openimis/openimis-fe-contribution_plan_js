import React, { Component } from "react"
import { withModulesManager, withHistory, historyPush, formatMessageWithValues } from "@openimis/fe-core";
import { injectIntl } from "react-intl";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { styled } from "@mui/material/styles";
import { createContributionPlanBundle, updateContributionPlanBundle } from "../actions"
import ContributionPlanBundleForm from "../components/ContributionPlanBundleForm"
import { RIGHT_CONTRIBUTION_PLAN_BUNDLE_CREATE, RIGHT_CONTRIBUTION_PLAN_BUNDLE_UPDATE } from "../constants"

const StyledPage = styled('div')(({ theme }) => ({
  ...theme.page,
}));

class ContributionPlanBundlePage extends Component {
    back = () => {
        historyPush(this.props.modulesManager, this.props.history, "contributionPlan.route.contributionPlanBundles")
    }

    save = contributionPlanBundle => {
        if (!!contributionPlanBundle.id) {
            this.props.updateContributionPlanBundle(
                contributionPlanBundle,
                formatMessageWithValues(
                    this.props.intl,
                    "contributionPlan",
                    "UpdateContributionPlanBundle.mutationLabel",
                    this.titleParams(contributionPlanBundle)
                )
            );
        } else {
            this.props.createContributionPlanBundle(
                contributionPlanBundle,
                formatMessageWithValues(
                    this.props.intl,
                    "contributionPlan",
                    "CreateContributionPlanBundle.mutationLabel",
                    this.titleParams(contributionPlanBundle)
                )
            );
        }
    }

    titleParams = contributionPlanBundle => ({ label: !!contributionPlanBundle.name ? contributionPlanBundle.name : null });

    render() {
        const { rights, contributionPlanBundleId } = this.props;
        return (
            rights.includes(RIGHT_CONTRIBUTION_PLAN_BUNDLE_CREATE) && rights.includes(RIGHT_CONTRIBUTION_PLAN_BUNDLE_UPDATE) && (
                <StyledPage>
                    <ContributionPlanBundleForm
                        contributionPlanBundleId={contributionPlanBundleId}
                        back={this.back}
                        save={this.save}
                        title="contributionPlanBundle.page.title"
                        titleParams={this.titleParams}
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
    return bindActionCreators({ createContributionPlanBundle, updateContributionPlanBundle }, dispatch);
};

export { StyledPage };
export default withHistory(withModulesManager(injectIntl(connect(mapStateToProps, mapDispatchToProps)(ContributionPlanBundlePage))));
