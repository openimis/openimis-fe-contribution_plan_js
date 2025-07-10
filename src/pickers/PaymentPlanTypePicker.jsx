import React from 'react';
import { ConstantBasedPicker } from '@openimis/fe-core';
import { PAYMENT_PLAN_TYPE_LIST } from '../constants';

function PaymentPlanTypePicker(props) {
    const {
        required, withNull, readOnly, onChange, value, nullLabel, withLabel,
    } = props;
    return (
        <ConstantBasedPicker
            module="contributionPlan"
            label="paymentPlan.type"
            constants={PAYMENT_PLAN_TYPE_LIST}
            onChange={onChange}
            value={value}
            required={required}
            readOnly={readOnly}
            withNull={withNull}
            nullLabel={nullLabel}
            withLabel={withLabel}
        />
    );
}

export default PaymentPlanTypePicker;