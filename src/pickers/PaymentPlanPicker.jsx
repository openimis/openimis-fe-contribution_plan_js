import React, { useMemo, useState } from "react";
import { Autocomplete, useGraphqlQuery, useModulesManager, useTranslations } from "@openimis/fe-core";

const PICKER_PROJECTION = "id code name benefitPlan";
// The picker shows a plan as "<code> - <name>": text typed in that shape, or left in the
// input after a choice, is searched as a code and a name together.
const LABEL_SEPARATOR = " - ";

export const paymentPlanLabel = (plan) => (plan ? `${plan.code ?? ""}${LABEL_SEPARATOR}${plan.name ?? ""}` : "");

// The filters the caller's props impose, whatever the user types.
export const queryParams = ({ periodicity, benefitPlanId, benefitPlanType, withDeleted = false }) => {
  const params = [`isDeleted: ${withDeleted}`];
  if (periodicity) {
    params.push(`periodicity: ${periodicity}`);
  }
  if (benefitPlanId) {
    params.push(`benefitPlanId: "${benefitPlanId}"`);
  }
  // e.g. PAYMENT_PLAN_TYPE.BENEFIT_PLAN, to leave out the plans of insurance products
  if (benefitPlanType) {
    params.push(`benefitPlanType_Model: "${benefitPlanType}"`);
  }
  return params;
};

const connection = (alias, filters) =>
  `${alias}: paymentPlan(${filters.join(", ")}) { edges { node { ${PICKER_PROJECTION} } } }`;

// The server returns at most one page (RELAY_CONNECTION_MAX_LIMIT) of plans, so the
// search must run on the server. `paymentPlan` filters code and name separately and
// combines filters with AND: matching either one takes a connection for each.
export const searchQuery = (params, search) => {
  const trimmed = search?.trim();
  if (!trimmed) {
    return {
      operation: `query PaymentPlanPicker { ${connection("all", params)} }`,
      variables: {},
    };
  }
  const variables = { search: trimmed };
  const connections = [
    connection("byCode", [...params, "code_Icontains: $search"]),
    connection("byName", [...params, "name_Icontains: $search"]),
  ];
  const declarations = ["$search: String"];
  const separator = trimmed.indexOf(LABEL_SEPARATOR);
  if (separator > 0) {
    variables.labelCode = trimmed.slice(0, separator).trim();
    variables.labelName = trimmed.slice(separator + LABEL_SEPARATOR.length).trim();
    connections.push(
      connection("byLabel", [...params, "code_Icontains: $labelCode", "name_Icontains: $labelName"]),
    );
    declarations.push("$labelCode: String", "$labelName: String");
  }
  return {
    operation: `query PaymentPlanPicker(${declarations.join(", ")}) { ${connections.join(" ")} }`,
    variables,
  };
};

const mergeConnections = (data) => {
  const seen = new Set();
  return Object.values(data ?? {})
    .flatMap((result) => result?.edges ?? [])
    .map((edge) => edge.node)
    .filter((plan) => !seen.has(plan.id) && seen.add(plan.id));
};

const PaymentPlanPicker = (props) => {
  const {
    value,
    onChange,
    required = false,
    withNull = false,
    nullLabel = null,
    withLabel = true,
    readOnly = false,
    periodicity,
    benefitPlanId,
    benefitPlanType,
    withDeleted = false,
  } = props;
  const modulesManager = useModulesManager();
  const { formatMessage } = useTranslations("contributionPlan", modulesManager);
  const [search, setSearch] = useState(null);

  const params = queryParams({ periodicity, benefitPlanId, benefitPlanType, withDeleted });
  const { operation, variables } = searchQuery(params, search);
  const { isLoading, data, error } = useGraphqlQuery(operation, variables);
  const options = useMemo(() => mergeConnections(data), [data]);

  // As before, the value is shown through the fields of the published projection only.
  const projection = modulesManager.getRef("contributionPlan.PaymentPlanPicker.projection");
  const pickerValue = useMemo(() => {
    if (!value || !projection) return null;
    return Object.fromEntries(projection.map((key) => [key, value[key]]));
  }, [value, projection]);

  return (
    <Autocomplete
      required={required}
      readOnly={readOnly}
      error={error}
      withLabel={withLabel}
      label={withLabel ? formatMessage("paymentPlanPicker.label") : null}
      // Without a value the picker reads as the "no plan" choice: the clear button sets it.
      placeholder={withNull && typeof nullLabel === "string" ? nullLabel : undefined}
      options={options}
      isLoading={isLoading}
      value={pickerValue}
      getOptionLabel={paymentPlanLabel}
      onChange={(plan) => onChange(plan ?? null)}
      onInputChange={(text) => setSearch(text ?? null)}
    />
  );
};

export { PaymentPlanPicker };
export default PaymentPlanPicker;
