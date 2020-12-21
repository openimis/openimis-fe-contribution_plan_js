import React, { Component, Fragment } from "react";
import { Form, withModulesManager, withHistory, formatMessage, journalize } from "@openimis/fe-core";
import { injectIntl } from "react-intl";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import ContributionPlanHeadPanel from "./ContributionPlanHeadPanel"

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
            contributionPlan: {}
        };
    }

    componentDidMount() {
        document.title = formatMessage(this.props.intl, "contributionPlan", "contributionPlan.page.title")
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.submittingMutation && !this.props.submittingMutation) {
            this.props.journalize(this.props.mutation);
        }
    }

    isMandatoryFieldsEmpty = () => {
        const { contributionPlan } = this.state;
        if (!!contributionPlan.code
            && !!contributionPlan.name
            && !!contributionPlan.calculation
            && !!contributionPlan.benefitPlan
            && !!contributionPlan.periodicity
            && !!contributionPlan.dateValidFrom) {
            return false;
        }
        return true;
    }

    canSave = () => !this.isMandatoryFieldsEmpty();

    save = contributionPlan => this.props.save(contributionPlan);

    onEditedChanged = contributionPlan => this.setState({ contributionPlan })

    titleParams = () => this.props.titleParams(this.state.contributionPlan);

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
                    saveTooltip={formatMessage(intl, "contributionPlan", `saveContributionPlanButton.tooltip.${this.canSave() ? 'enabled' : 'disabled'}`)} 
                />
            </Fragment>
        )
    }
}

const mapStateToProps = state => ({
    submittingMutation: state.contributionPlan.submittingMutation,
    mutation: state.contributionPlan.mutation
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ journalize }, dispatch);
};

export default withHistory(withModulesManager(injectIntl(withTheme(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(ContributionPlanForm))))));
