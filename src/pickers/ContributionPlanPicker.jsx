import React, { Component } from "react";
import { FormattedMessage, formatGQLString, withModulesManager, SelectInput } from "@openimis/fe-core";
import { fetchPickerContributionPlans } from "../actions"
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

class ContributionPlanPicker extends Component {
    componentDidMount() {
        this.props.fetchPickerContributionPlans(this.props.modulesManager, this.queryParams());
    }

    componentDidUpdate(prevProps) {
        // The list of plans depends on the filters below: reload them when one of them changes.
        const { periodicity, withDeleted = false, benefitPlanTypeModel } = this.props;
        if (
            prevProps.periodicity !== periodicity ||
            (prevProps.withDeleted ?? false) !== withDeleted ||
            prevProps.benefitPlanTypeModel !== benefitPlanTypeModel
        ) {
            this.props.fetchPickerContributionPlans(this.props.modulesManager, this.queryParams());
        }
    }
    queryParams = () => {
        const { periodicity, withDeleted = false, benefitPlanTypeModel } = this.props;
        let params = [];
        params.push(`isDeleted: ${withDeleted}`);
        if (!!periodicity) {
            params.push(`periodicity: ${periodicity}`);
        }
        // Restricts the list to the plans attached to a given kind of benefit plan
        // (e.g. "product"): the argument is already exposed by the contributionPlan query.
        if (!!benefitPlanTypeModel) {
            params.push(`benefitPlanType_Model: "${formatGQLString(benefitPlanTypeModel)}"`);
        }
        return params;
    }

    render() {
        const { modulesManager, pickerContributionPlans, value, onChange, required = false,
            withNull = false, nullLabel = null, withLabel = true, readOnly = false } = this.props;
        let options = [
            ...pickerContributionPlans.map(v => ({
                value: v,
                label: `${v.code} - ${v.name}`
            }))
        ];
        if (withNull) {
            options.unshift({
                value: null,
                label: nullLabel || <FormattedMessage module="contributionPlan" id="emptyLabel" />
            })
        }
        let contributionPlanPickerValue = null;
        const contributionPlanPickerProjection = modulesManager.getRef("contributionPlan.ContributionPlanPicker.projection");
        if (!!value && !!contributionPlanPickerProjection) {
            contributionPlanPickerValue = {};
            contributionPlanPickerProjection.forEach(key => {
                contributionPlanPickerValue[key] = value[key]
            });
        }
        return (
            <SelectInput
                module="contributionPlan"
                label={withLabel ? "contributionPlan.label" : null}
                required={required}
                options={options}
                value={contributionPlanPickerValue}
                onChange={onChange}
                readOnly={readOnly}
            />
        )
    }
}

const mapStateToProps = state => ({
    pickerContributionPlans: state.contributionPlan.pickerContributionPlans
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ fetchPickerContributionPlans }, dispatch);
};

export { ContributionPlanPicker };
export default withModulesManager(connect(mapStateToProps, mapDispatchToProps)(ContributionPlanPicker));
