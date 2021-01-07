import React, { Component } from "react";
import { FormattedMessage, withModulesManager, SelectInput, decodeId } from "@openimis/fe-core";
import { fetchContributionPlans } from "../actions"
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

class ContributionPlanPicker extends Component {
    componentDidMount() {
        this.props.fetchContributionPlans(this.props.modulesManager, this.queryParams());
    }

    queryParams = () => {
        const { periodicity, withDeleted = false } = this.props;
        let params = [];
        params.push(`isDeleted: ${withDeleted}`);
        if (!!periodicity) {
            params.push(`periodicity: ${periodicity}`);
        }
        return params;
    }

    render() {
        const { contributionPlans, value, onChange, required = false, withNull = false, nullLabel = null, withLabel = true, readOnly = false } = this.props;
        let options = [
            ...contributionPlans.map(v => ({
                value: decodeId(v.id),
                label: v.name
            }))
        ];
        if (withNull) {
            options.unshift({
                value: null,
                label: nullLabel || <FormattedMessage module="contributionPlan" id="contributionPlan.emptyLabel" />
            })
        }
        return (
            <SelectInput
                module="contributionPlan"
                label={withLabel ? "contributionPlan.label" : null}
                required={required}
                options={options}
                value={!!value ? value : null}
                onChange={onChange}
                readOnly={readOnly}
            />
        )
    }
}

const mapStateToProps = state => ({
    contributionPlans: state.contributionPlan.contributionPlans
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ fetchContributionPlans }, dispatch);
};

export default withModulesManager(connect(mapStateToProps, mapDispatchToProps)(ContributionPlanPicker));
