/* eslint-disable import/no-extraneous-dependencies -- Vitest runs from the frontend assembly */
import React from 'react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { combineReducers, createStore } from 'redux';
import { act, render, screen } from '@testing-library/react';
import {
  describe, expect, it, vi,
} from 'vitest';

vi.mock('@openimis/fe-core', () => ({
  GetIconComponent: (name) => function Icon() { return <span>{name}</span>; },
  formatMessage: (intl, module, key) => key,
  decodeId: (id) => id,
  fetchCustomFilter: vi.fn(() => ({ type: 'FETCH_CUSTOM_FILTER' })),
}));

vi.mock('./AdvancedCriteriaRowValue', () => ({
  default: function RowValue({ readOnly }) { return <span data-testid="row" data-readonly={String(!!readOnly)} />; },
}));

const { default: AdvancedCriteriaDialog } = await import('./AdvancedCriteriaDialog');

// `SET_CONFIRMED` stands in for any other dialog in the app being answered.
const coreReducer = (state = { confirmed: null }, action) => (
  action.type === 'SET_CONFIRMED' ? { ...state, confirmed: action.payload } : state);

const renderDialog = ({ confirmed = null, readOnly = false } = {}) => {
  const store = createStore(combineReducers({ core: coreReducer }), { core: { confirmed } });
  render(
    <IntlProvider locale="en">
      <Provider store={store}>
        <AdvancedCriteriaDialog
          object={{ id: 'plan-1' }}
          objectToSave={{ jsonExt: '{}' }}
          moduleName="social_protection"
          objectType="BenefitPlan"
          getDefaultAppliedCustomFilters={() => [{ field: 'f', filter: 'exact', type: 'string', value: 'v' }]}
          setAppliedCustomFilters={vi.fn()}
          setAppliedFiltersRowStructure={vi.fn()}
          updateAttributes={vi.fn()}
          readOnly={readOnly}
        />
      </Provider>
    </IntlProvider>,
  );
  return store;
};

const button = (key) => screen.getByText(key).closest('button');
const KEYS = [
  'paymentPlan.advancedCriteria.button.addFilters',
  'paymentPlan.advancedCriteria.button.clearAllFilters',
  'paymentPlan.advancedCriteria.button.filter',
];
const expectEditable = (editable) => {
  KEYS.forEach((key) => expect(button(key).disabled).toBe(!editable));
  expect(screen.getByTestId('row').dataset.readonly).toBe(String(!editable));
};

describe('AdvancedCriteriaDialog lock', () => {
  it('stays editable when a stale "Yes" is already in the store', () => {
    renderDialog({ confirmed: true });

    expectEditable(true);
  });

  it('stays editable when another dialog in the app is answered "Yes"', () => {
    const store = renderDialog();

    act(() => { store.dispatch({ type: 'SET_CONFIRMED', payload: true }); });

    expectEditable(true);
  });

  it('is locked by readOnly', () => {
    renderDialog({ readOnly: true });

    expectEditable(false);
  });
});
