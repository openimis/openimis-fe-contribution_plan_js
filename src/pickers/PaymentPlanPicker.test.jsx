/* eslint-disable import/no-extraneous-dependencies -- Vitest runs from the frontend assembly */
import { describe, expect, it, vi } from 'vitest';
import { PaymentPlanPicker } from './PaymentPlanPicker';

vi.mock('@openimis/fe-core', () => ({
  FormattedMessage: () => null,
  SelectInput: () => null,
  withModulesManager: (component) => component,
}));
vi.mock('../actions', () => ({ fetchPickerPaymentPlans: () => ({ type: 'TEST_FETCH' }) }));

const queryParams = (props) => new PaymentPlanPicker(props).queryParams();

describe('PaymentPlanPicker', () => {
  it('only queries payment plans that are not deleted by default', () => {
    expect(queryParams({})).toEqual(['isDeleted: false']);
  });

  // OP-3263: a payroll can only pay the beneficiaries of a programme, so its picker must
  // be able to leave out the payment plans linked to an insurance product.
  it('narrows the query to one kind of benefit plan when asked', () => {
    expect(queryParams({ benefitPlanType: 'benefitplan' })).toContain('benefitPlanType_Model: "benefitplan"');
  });
});
