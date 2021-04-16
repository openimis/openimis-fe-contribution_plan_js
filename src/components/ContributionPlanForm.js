import React, { Component, Fragment } from "react";
import {
    Form,
    withModulesManager,
    withHistory,
    formatMessage,
    formatMessageWithValues,
    journalize
} from "@openimis/fe-core";
import { injectIntl } from "react-intl";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import ContributionPlanHeadPanel from "./ContributionPlanHeadPanel";
import { fetchContributionPlan } from "../actions";
import { MAX_PERIODICITY_VALUE, MIN_PERIODICITY_VALUE } from "../constants";

const styles = theme => ({
    paper: theme.paper.paper,
    paperHeader: theme.paper.header,
    paperHeaderAction: theme.paper.action,
    item: theme.paper.item,
});

class ContributionPlanForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            contributionPlan: {},
            jsonExtValid: true
        };
    }

    componentDidMount() {
        document.title = formatMessageWithValues(this.props.intl, "contributionPlan", "contributionPlan.page.title", this.titleParams());
        if (!!this.props.contributionPlanId) {
            this.props.fetchContributionPlan(this.props.modulesManager, this.props.contributionPlanId);
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.fetchedContributionPlan !== this.props.fetchedContributionPlan && !!this.props.fetchedContributionPlan) {
            this.setState(
                (_, props) => ({ contributionPlan: props.contributionPlan }),
                () => document.title = formatMessageWithValues(this.props.intl, "contributionPlan", "contributionPlan.page.title", this.titleParams())
            );
        }
        if (prevProps.submittingMutation && !this.props.submittingMutation) {
            this.props.journalize(this.props.mutation);
        }
    }

    isMandatoryFieldsEmpty = () => {
        const { contributionPlan } = this.state;
        if (
            !!contributionPlan.code &&
            !!contributionPlan.name &&
            !!contributionPlan.calculation &&
            !!contributionPlan.benefitPlan &&
            !!contributionPlan.periodicity &&
            !!contributionPlan.dateValidFrom
        ) {
            return false;
        }
        return true;
    }

    isPeriodicityValid = () => {
        let periodicityInt = parseInt(this.state.contributionPlan.periodicity);
        return !!periodicityInt ? periodicityInt >= MIN_PERIODICITY_VALUE && periodicityInt <= MAX_PERIODICITY_VALUE : false;
    }

    canSave = () => !this.isMandatoryFieldsEmpty() && this.isPeriodicityValid() && !!this.state.jsonExtValid;

    save = contributionPlan => this.props.save(contributionPlan);

    onEditedChanged = contributionPlan => this.setState({ contributionPlan })

    titleParams = () => this.props.titleParams(this.state.contributionPlan);

    setJsonExtValid = (valid) => this.setState({ jsonExtValid: !!valid });

    render() {
        const { intl, back } = this.props;
        return (
            <Fragment>
                <Form
                    module="contributionPlan"
                    title="contributionPlan.page.title"
                    titleParams={this.titleParams()}
                    edited={this.state.contributionPlan}
                    back={back}
                    canSave={this.canSave}
                    save={this.save}
                    onEditedChanged={this.onEditedChanged}
                    HeadPanel={ContributionPlanHeadPanel}
                    mandatoryFieldsEmpty={this.isMandatoryFieldsEmpty()}
                    saveTooltip={formatMessage(intl, "contributionPlan", `saveButton.tooltip.${this.canSave() ? 'enabled' : 'disabled'}`)}
                    setJsonExtValid={this.setJsonExtValid}
                />
            </Fragment>
        )
    }
}

const mapStateToProps = state => ({
    fetchingContributionPlan: state.contributionPlan.fetchingContributionPlan,
    fetchedContributionPlan: state.contributionPlan.fetchedContributionPlan,
    contributionPlan: state.contributionPlan.contributionPlan,
    errorContributionPlan: state.contributionPlan.errorContributionPlan,
    submittingMutation: state.contributionPlan.submittingMutation,
    mutation: state.contributionPlan.mutation
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ fetchContributionPlan, journalize }, dispatch);
};

export default withHistory(withModulesManager(injectIntl(withTheme(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(ContributionPlanForm))))));
