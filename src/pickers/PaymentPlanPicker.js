import React, { Component } from "react";
import { FormattedMessage, withModulesManager, SelectInput } from "@openimis/fe-core";
import { fetchPickerPaymentPlans } from "../actions"
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

class PaymentPlanPicker extends Component {
    componentDidMount() {
        this.props.fetchPickerPaymentPlans(this.props.modulesManager, this.queryParams());
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
        const { modulesManager, pickerPaymentPlans, value, onChange, required = false,
            withNull = false, nullLabel = null, withLabel = true, readOnly = false } = this.props;
        let options = [
            ...pickerPaymentPlans.map(v => ({
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
        let paymentPlanPickerValue = null;
        const paymentPlanPickerProjection = modulesManager.getRef("contributionPlan.PaymentPlanPicker.projection");
        if (!!value && !!paymentPlanPickerProjection) {
            paymentPlanPickerValue = {};
            paymentPlanPickerProjection.forEach(key => {
                paymentPlanPickerValue[key] = value[key]
            });
        }
        return (
            <SelectInput
                module="contributionPlan"
                label={withLabel ? "paymentPlanPicker.label" : null}
                required={required}
                options={options}
                value={paymentPlanPickerValue}
                onChange={onChange}
                readOnly={readOnly}
            />
        )
    }
}

const mapStateToProps = state => ({
    pickerPaymentPlans: state.contributionPlan.pickerPaymentPlans
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ fetchPickerPaymentPlans }, dispatch);
};

export default withModulesManager(connect(mapStateToProps, mapDispatchToProps)(PaymentPlanPicker));
