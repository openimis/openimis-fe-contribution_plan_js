/* eslint-disable import/no-extraneous-dependencies -- Vitest runs from the frontend assembly */
import React, { useEffect, useRef, useState } from 'react';
import {
  beforeEach, describe, expect, it, vi,
} from 'vitest';
import {
  makeStore, renderWithProviders, screen, userEvent,
} from '@openimis/fe-core/testing';

// graphene-django caps a connection at RELAY_CONNECTION_MAX_LIMIT.
const SERVER_PAGE_LIMIT = 100;
const PROJECTION = ['id', 'code', 'name', 'periodicity', 'dateValidFrom', 'dateValidTo', 'isDeleted',
  'replacementUuid', 'benefitPlan'];

const plan = (n) => ({
  id: `UGF5bWVudFBsYW5HUUxUeXBlOj${n}`,
  code: `PP-${String(n).padStart(3, '0')}`,
  name: `Payment plan ${n}`,
  benefitPlan: '{}',
});
// More plans than the server returns in one page: the last one is never in the
// unfiltered first page.
const PLANS = Array.from({ length: SERVER_PAGE_LIMIT + 6 }, (_, i) => plan(i + 1));
const FIRST_PAGE = PLANS.slice(0, SERVER_PAGE_LIMIT);
const LAST_PLAN = PLANS[PLANS.length - 1];
const label = (p) => `${p.code} - ${p.name}`;

// A stand-in for the backend: each `paymentPlan` connection of the operation, aliased
// or not, gets the plans whose code or name contains every variable that connection
// filters on, capped at one page like the real server.
const fakeServer = (operation, variables = {}) => {
  const connections = [...operation.matchAll(/(?:(\w+)\s*:\s*)?paymentPlan\s*\(([^)]*)\)/g)];
  return Object.fromEntries(connections.map(([, alias, args]) => {
    const terms = [...args.matchAll(/\$(\w+)/g)]
      .map(([, name]) => variables[name])
      .filter((v) => typeof v === 'string' && v)
      .map((v) => v.toLowerCase());
    const matching = PLANS.filter((p) => terms.every(
      (t) => p.code.toLowerCase().includes(t) || p.name.toLowerCase().includes(t),
    ));
    return [alias ?? 'paymentPlan', { edges: matching.slice(0, SERVER_PAGE_LIMIT).map((node) => ({ node })) }];
  }));
};

const modulesManager = {
  getRef: (key) => (key === 'contributionPlan.PaymentPlanPicker.projection' ? PROJECTION : null),
  getConf: (module, key, defaultValue = null) => defaultValue,
};

const useGraphqlQuery = vi.fn();
// The requests the picker's queries sent to the server, as opposed to the renders that
// merely called the hook.
let sentRequests = [];

// Sends a request when fe-core's useGraphqlQuery does: on mount unless `skip`, then each
// time the operation, the variables or the `refreshKey` change.
const useFakeGraphqlQuery = (operation, variables, config = {}) => {
  const [data, setData] = useState(null);
  const last = useRef(null);
  useEffect(() => {
    const prev = last.current;
    last.current = { operation, variables, refreshKey: config.refreshKey };
    const send = prev
      ? operation !== prev.operation || JSON.stringify(variables) !== JSON.stringify(prev.variables)
        || (config.refreshKey !== undefined && config.refreshKey !== prev.refreshKey)
      : !config.skip;
    if (!send) return;
    sentRequests.push({ operation, variables });
    setData(fakeServer(operation, variables));
  });
  return { isLoading: false, error: null, data };
};
const fetchPickerPaymentPlans = vi.fn(() => ({ type: 'TEST_FETCH' }));

// The fe-core barrel cannot be loaded from a module test. Autocomplete keeps the
// contract of fe-core's: options are what the caller gives, onChange receives the
// chosen option, onInputChange receives what the user types (debounce left out), and is
// called without a search when the list opens.
vi.mock('@openimis/fe-core', async () => {
  const { createElement: h } = await import('react');
  const { Autocomplete: MuiAutocomplete, TextField } = await import('@mui/material');
  return {
    FormattedMessage: () => null,
    SelectInput: ({ options }) => h('ul', null, options.map((o) => h('li', { key: o.label }, o.label))),
    withModulesManager: (Component) => (props) => h(Component, { ...props, modulesManager }),
    useModulesManager: () => modulesManager,
    useTranslations: () => ({ formatMessage: (id) => id }),
    useGraphqlQuery: (...args) => useGraphqlQuery(...args),
    decodeId: (id) => id,
    Autocomplete: ({
      options, value, onChange, onInputChange, getOptionLabel, isOptionEqualToValue, filterOptions, label: text,
      readOnly,
    }) => h(MuiAutocomplete, {
      options,
      value,
      getOptionLabel,
      isOptionEqualToValue: isOptionEqualToValue ?? ((o, v) => o.id === v?.id),
      filterOptions,
      disabled: readOnly,
      onChange: (__, v) => onChange(v),
      onOpen: () => onInputChange(),
      onInputChange: (__, q, reason) => reason === 'input' && onInputChange(q),
      renderInput: (params) => h(TextField, { ...params, label: text }),
    }),
  };
});
vi.mock('../actions', () => ({ fetchPickerPaymentPlans: (...args) => fetchPickerPaymentPlans(...args) }));

const { default: PaymentPlanPicker } = await import('./PaymentPlanPicker');

const renderPicker = (props = {}) => renderWithProviders(
  <PaymentPlanPicker onChange={() => {}} value={null} {...props} />,
  { store: makeStore({ reducers: { contributionPlan: (state = { pickerPaymentPlans: FIRST_PAGE }) => state } }) },
);

// Every query the picker sent, whichever way it sends them.
const sentQueries = () => [
  ...useGraphqlQuery.mock.calls.map(([operation]) => operation),
  ...fetchPickerPaymentPlans.mock.calls.map(([, params]) => params.join(', ')),
];

describe('PaymentPlanPicker', () => {
  beforeEach(() => {
    sentRequests = [];
    useGraphqlQuery.mockImplementation(useFakeGraphqlQuery);
  });

  it('only queries payment plans that are not deleted by default', () => {
    renderPicker();
    expect(sentQueries()[0]).toContain('isDeleted: false');
  });

  // OP-3263: a payroll can only pay the beneficiaries of a programme, so its picker must
  // be able to leave out the payment plans linked to an insurance product.
  it('narrows the query to one kind of benefit plan when asked', () => {
    renderPicker({ benefitPlanType: 'benefitplan' });
    expect(sentQueries()[0]).toContain('benefitPlanType_Model: "benefitplan"');
  });

  // The server returns at most one page of plans, so a plan past that page is offered
  // only if what the user types reaches the server as a search.
  it('sends what the user types to the server as a search on code and name', async () => {
    renderPicker({ benefitPlanType: 'benefitplan' });
    const user = userEvent.setup();
    await user.type(screen.getByRole('combobox'), LAST_PLAN.code);

    const [operation, variables] = useGraphqlQuery.mock.lastCall;
    expect(variables).toMatchObject({ search: LAST_PLAN.code });
    expect(operation).toMatch(/code_Icontains: \$search/);
    expect(operation).toMatch(/name_Icontains: \$search/);
    // The search narrows the caller's filters, it does not replace them.
    expect(operation).toContain('isDeleted: false');
    expect(operation).toContain('benefitPlanType_Model: "benefitplan"');
  });

  it.each([
    ['its code', LAST_PLAN.code],
    ['its name', LAST_PLAN.name],
    ['the label the picker shows', label(LAST_PLAN)],
  ])('offers and selects a plan beyond the first page when typing %s', async (_, typed) => {
    const onChange = vi.fn();
    renderPicker({ onChange });
    const user = userEvent.setup();
    await user.type(screen.getByRole('combobox'), typed);

    await user.click(await screen.findByRole('option', { name: label(LAST_PLAN) }));
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ id: LAST_PLAN.id, code: LAST_PLAN.code }));
  });

  it('shows the current value with the label of its option', () => {
    renderPicker({ value: { ...LAST_PLAN, periodicity: 1, notInProjection: 'x' } });
    expect(screen.getByRole('combobox')).toHaveValue(label(LAST_PLAN));
  });

  // A page mounts the picker in its filters or its form: listing every payment plan, each
  // with its benefit plan, costs the backend seconds that nobody asked for until the list
  // is opened.
  it('sends no query until the list is opened', async () => {
    renderPicker({ benefitPlanType: 'benefitplan' });
    await Promise.resolve();
    expect(sentRequests).toEqual([]);

    const user = userEvent.setup();
    await user.click(screen.getByRole('combobox'));
    expect(sentRequests).toHaveLength(1);
    expect(sentRequests[0].operation).toContain('isDeleted: false');
    expect(sentRequests[0].operation).toContain('benefitPlanType_Model: "benefitplan"');
    expect(await screen.findByRole('option', { name: label(FIRST_PAGE[0]) })).toBeInTheDocument();
  });

  it('sends no query for a read-only picker showing its value', async () => {
    renderPicker({ readOnly: true, value: LAST_PLAN });
    await Promise.resolve();
    expect(screen.getByRole('combobox')).toHaveValue(label(LAST_PLAN));
    expect(sentRequests).toEqual([]);
  });

  it('lists the plans once however often the list is reopened', async () => {
    renderPicker();
    const user = userEvent.setup();
    const combobox = screen.getByRole('combobox');
    await user.click(combobox);
    await user.keyboard('{Escape}');
    await user.click(document.body);
    await user.click(combobox);
    expect(sentRequests).toHaveLength(1);
  });
});
