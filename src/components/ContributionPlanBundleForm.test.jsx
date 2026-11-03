/* eslint-disable import/no-extraneous-dependencies -- Vitest runs from the frontend assembly */
import React from 'react';
import { render } from '@testing-library/react';
import {
  describe, expect, it, vi,
} from 'vitest';

vi.mock('@openimis/fe-core', () => ({
  Form: () => null,
  Helmet: () => null,
  withModulesManager: (component) => component,
  withHistory: (component) => component,
  formatMessage: (intl, module, key) => key,
  formatMessageWithValues: (intl, module, key) => key,
  decodeId: (id) => id,
  journalize: () => ({ type: 'TEST_JOURNALIZE' }),
}));
vi.mock('../actions', () => ({
  fetchContributionPlanBundle: () => ({ type: 'TEST_FETCH' }),
  clearContributionPlanBundle: () => ({ type: 'TEST_CLEAR' }),
  clearContributionPlanBundleDetails: () => ({ type: 'TEST_CLEAR_DETAILS' }),
}));
vi.mock('./ContributionPlanBundleContributionPlans', () => ({ default: () => null }));
vi.mock('./ContributionPlanBundleHeadPanel', () => ({ default: () => null }));

const { ContributionPlanBundleForm } = await import('./ContributionPlanBundleForm');

const BUNDLE_ID = '7a1d0c55-9b0e-4c43-8a8c-2f5e0d6b1f10';
const EDIT_ROUTE = 'contributionPlanBundles/contributionPlanBundle';

// Mounts the form, then simulates the bundle fetch completing
// (fetchedContributionPlanBundle going false -> true) and returns the history stub.
const loadBundle = ({ contributionPlanBundleId, isReplacing }) => {
  const history = { replace: vi.fn() };
  const props = {
    contributionPlanBundleId,
    isReplacing,
    history,
    modulesManager: { getRef: (key) => (key === 'contributionPlan.route.contributionPlanBundle' ? EDIT_ROUTE : key) },
    intl: {},
    titleParams: () => ({}),
    fetchContributionPlanBundle: vi.fn(),
    clearContributionPlanBundle: vi.fn(),
    clearContributionPlanBundleDetails: vi.fn(),
    journalize: vi.fn(),
    fetchedContributionPlanBundle: false,
    contributionPlanBundle: null,
  };
  const { rerender } = render(<ContributionPlanBundleForm {...props} />);
  rerender(
    <ContributionPlanBundleForm
      {...props}
      fetchedContributionPlanBundle
      contributionPlanBundle={{ id: BUNDLE_ID, code: 'B1', name: 'Bundle' }}
    />,
  );
  return history;
};

describe('ContributionPlanBundleForm', () => {
  // OP-3297: "Add New Version" must stay on the replace route once the bundle loads,
  // otherwise Save edits the current version instead of creating a new one.
  it('stays on the replace page after the bundle loads', () => {
    const history = loadBundle({ contributionPlanBundleId: BUNDLE_ID, isReplacing: true });
    expect(history.replace).not.toHaveBeenCalled();
  });

  it('does not redirect when an existing bundle is opened for editing', () => {
    const history = loadBundle({ contributionPlanBundleId: BUNDLE_ID, isReplacing: false });
    expect(history.replace).not.toHaveBeenCalled();
  });

  // OP-794: once a new bundle is created, move to its edit page so contribution plans can be added.
  it('moves to the edit page of a newly created bundle', () => {
    const history = loadBundle({ contributionPlanBundleId: undefined, isReplacing: false });
    expect(history.replace).toHaveBeenCalledWith(`/${EDIT_ROUTE}/${BUNDLE_ID}`);
  });
});
