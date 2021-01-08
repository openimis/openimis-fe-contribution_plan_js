import React, { Component, Fragment } from "react";
import { Form, withModulesManager, withHistory, formatMessage, formatMessageWithValues, journalize } from "@openimis/fe-core";
import { injectIntl } from "react-intl";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import ContributionPlanBundleHeadPanel from "./ContributionPlanBundleHeadPanel"
import { MAX_PERIODICITY_VALUE, MIN_PERIODICITY_VALUE } from "../constants";
import { fetchContributionPlanBundle } from "../actions";
import ContributionPlanBundleContributionPlans from "./ContributionPlanBundleContributionPlans";

class ContributionPlanBundleForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            contributionPlanBundle: {}
        };
    }

    componentDidMount() {
        document.title = formatMessageWithValues(this.props.intl, "contributionPlan", "contributionPlanBundle.page.title", this.titleParams());
        if (!!this.props.contributionPlanBundleId) {
            this.props.fetchContributionPlanBundle(this.props.contributionPlanBundleId)
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.fetchedContributionPlanBundle !== this.props.fetchedContributionPlanBundle && !!this.props.fetchedContributionPlanBundle) {
            this.setState(
                (state, props) => ({ contributionPlanBundle: props.contributionPlanBundle }),
                () => document.title = formatMessageWithValues(this.props.intl, "contributionPlan", "contributionPlanBundle.page.title", this.titleParams())
            );
        }
        if (prevProps.submittingMutation && !this.props.submittingMutation) {
            this.props.journalize(this.props.mutation);
        }
    }

    isMandatoryFieldsEmpty = () => {
        const { contributionPlanBundle } = this.state;
        if (!!contributionPlanBundle.code
            && !!contributionPlanBundle.name
            && !!contributionPlanBundle.periodicity
            && !!contributionPlanBundle.dateValidFrom) {
            return false;
        }
        return true;
    }

    isPeriodicityValid = () => {
        let periodicityInt = parseInt(this.state.contributionPlanBundle.periodicity);
        return !!periodicityInt ? periodicityInt >= MIN_PERIODICITY_VALUE && periodicityInt <= MAX_PERIODICITY_VALUE : false;
    }

    canSave = () => !this.isMandatoryFieldsEmpty() && this.isPeriodicityValid();

    save = contributionPlanBundle => this.props.save(contributionPlanBundle);

    onEditedChanged = contributionPlanBundle => this.setState({ contributionPlanBundle })

    titleParams = () => this.props.titleParams(this.state.contributionPlanBundle);

    render() {
        const { intl, back, contributionPlanBundleId, title, isReplacing = false } = this.props;
        return (
            <Fragment>
                <Form
                    module="contributionPlan"
                    title={title}
                    titleParams={this.titleParams()}
                    edited={this.state.contributionPlanBundle}
                    back={back}
                    canSave={this.canSave}
                    save={this.save}
                    onEditedChanged={this.onEditedChanged}
                    HeadPanel={ContributionPlanBundleHeadPanel}
                    mandatoryFieldsEmpty={this.isMandatoryFieldsEmpty()}
                    saveTooltip={formatMessage(intl, "contributionPlan", `saveButton.tooltip.${this.canSave() ? 'enabled' : 'disabled'}`)}
                    Panels={isReplacing ? [] : [ContributionPlanBundleContributionPlans]}
                    contributionPlanBundleId={contributionPlanBundleId}
                    isReplacing={isReplacing}
                />
            </Fragment>
        )
    }
}

const mapStateToProps = state => ({
    fetchingContributionPlanBundle: state.contributionPlan.fetchingContributionPlanBundle,
    fetchedContributionPlanBundle: state.contributionPlan.fetchedContributionPlanBundle,
    contributionPlanBundle: state.contributionPlan.contributionPlanBundle,
    errorContributionPlanBundle: state.contributionPlan.errorContributionPlanBundle,
    submittingMutation: state.contributionPlan.submittingMutation,
    mutation: state.contributionPlan.mutation
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ fetchContributionPlanBundle, journalize }, dispatch);
};

export default withHistory(withModulesManager(injectIntl(connect(mapStateToProps, mapDispatchToProps)(ContributionPlanBundleForm))));
