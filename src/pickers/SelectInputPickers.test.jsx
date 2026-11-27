/* eslint-disable import/no-extraneous-dependencies -- Vitest runs from the frontend assembly */
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { makeStore, renderWithProviders, screen } from '@openimis/fe-core/testing';

vi.mock('../actions', () => ({
  fetchPickerContributionPlans: vi.fn(() => ({ type: 'TEST_FETCH' })),
  fetchContributionPlanBundles: vi.fn(() => ({ type: 'TEST_FETCH' })),
}));

// The fe-core barrel cannot be loaded from a module test: SelectInput shows what it is given.
vi.mock('@openimis/fe-core', () => ({
  FormattedMessage: () => null,
  withModulesManager: (Component) => function WithModulesManager(props) {
    return <Component modulesManager={{ getRef: () => null }} {...props} />;
  },
  SelectInput: ({ loading }) => <span>{loading ? 'loading' : 'not loading'}</span>,
}));

const { default: ContributionPlanPicker } = await import('./ContributionPlanPicker');
const { default: ContributionPlanBundlePicker } = await import('./ContributionPlanBundlePicker');

const PICKERS = [
  ['ContributionPlanPicker', ContributionPlanPicker, { pickerContributionPlans: [] }, 'fetchingPickerContributionPlans'],
  ['ContributionPlanBundlePicker', ContributionPlanBundlePicker, { contributionPlanBundles: [] }, 'fetchingContributionPlanBundles'],
];

const renderPicker = (Picker, contributionPlan) => renderWithProviders(<Picker onChange={() => {}} />, {
  store: makeStore({ preloadedState: { contributionPlan }, reducers: { contributionPlan: (s = {}) => s } }),
});

describe.each(PICKERS)('%s (OP-3280)', (name, Picker, emptyState, fetchingKey) => {
  it('is loading while its options are fetched', () => {
    renderPicker(Picker, { ...emptyState, [fetchingKey]: true });

    expect(screen.getByText('loading')).toBeInTheDocument();
  });

  it('stops loading once they arrived', () => {
    renderPicker(Picker, { ...emptyState, [fetchingKey]: false });

    expect(screen.getByText('not loading')).toBeInTheDocument();
  });
});
