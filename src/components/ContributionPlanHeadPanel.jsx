import React, { Fragment } from "react";
import { connect } from "react-redux";
import { injectIntl } from "react-intl";

import { Grid, Divider, Typography } from "@mui/material";
import { styled } from '@mui/material/styles';

import {
  withModulesManager,
  formatMessage,
  FormPanel,
  TextInput,
  FormattedMessage,
  PublishedComponent,
  NumberInput,
  Contributions,
  ValidatedTextInput,
} from "@openimis/fe-core";
import {
  contributionPlanCodeValidation,
  contributionPlanCodeClear,
  contributionPlanCodeSetValid,
} from "../actions";
import {
  EMPTY_PERIODICITY_VALUE,
  MIN_PERIODICITY_VALUE,
  MAX_PERIODICITY_VALUE,
  CONTRIBUTIONPLAN_CALCULATION_CONTRIBUTION_KEY,
  CONTRIBUTIONPLAN_CALCULATIONRULE_CONTRIBUTION_KEY,
  CONTRIBUTIONPLAN_CLASSNAME,
  RIGHT_CALCULATION_WRITE,
  RIGHT_CALCULATION_UPDATE,
} from "../constants";

const StyledPanel = styled('div')(({ theme }) => ({
  '& .tableTitle': theme.table.title,
  '& .item': theme.paper.item,
  '& .fullHeight': {
    height: "100%",
  },
}));

const GRID_ITEM_SIZE = 3;

class ContributionPlanHeadPanel extends FormPanel {
  shouldValidate = (input) => {
    const { savedCode } = this.props;
    return input !== savedCode;
  };

  render() {
    const {
      intl,
      mandatoryFieldsEmpty,
      setJsonExtValid,
      isCodeValid,
      isCodeValidating,
      validationError,
    } = this.props;
    /**
     * Mapping @see benefitPlan property into @see product property is required
     * because property names of @see ContributionPlan object on frontend
     * have to match property names of a corresponding object on backend.
     * Also, @see calculation property, which is a UUID, has to be converted into an object
     * so that its @see id property can be used to fetch calculation parameters
     */
    const {
      benefitPlan: product,
      calculation: calculationId,
      ...others
    } = this.props.edited;
    const calculation = !!calculationId ? { id: calculationId } : null;
    const contributionPlan = { product, calculation, ...others };
    return (
      <StyledPanel>
        <Grid container className="tableTitle">
          <Grid>
            <Grid
              container
              align="center"
              justify="center"
              direction="column"
              className="fullHeight"
            >
              <Grid>
                <Typography>
                  <FormattedMessage
                    module="contributionPlan"
                    id="contributionPlan.headPanel.title"
                  />
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Divider />
        {mandatoryFieldsEmpty && (
          <Fragment>
            <div className="item">
              <FormattedMessage
                module="contributionPlan"
                id="mandatoryFieldsEmptyError"
              />
            </div>
            <Divider />
          </Fragment>
        )}
        <Grid container className="item">
          <Grid size={GRID_ITEM_SIZE} className="item">
            <ValidatedTextInput
              itemQueryIdentifier="contributionPlanCode"
              codeTakenLabel="contributionPlan.codeTaken"
              shouldValidate={this.shouldValidate}
              isValid={isCodeValid}
              isValidating={isCodeValidating}
              validationError={validationError}
              action={contributionPlanCodeValidation}
              clearAction={contributionPlanCodeClear}
              setValidAction={contributionPlanCodeSetValid}
              module="contributionPlan"
              required={true}
              label="code"
              value={!!contributionPlan.code ? contributionPlan.code : ""}
              onChange={(v) => this.updateAttribute("code", v)}
              readOnly={!!contributionPlan.id}
            />
          </Grid>
          <Grid size={GRID_ITEM_SIZE} className="item">
            <TextInput
              module="contributionPlan"
              label="name"
              required
              value={!!contributionPlan.name ? contributionPlan.name : ""}
              onChange={(v) => this.updateAttribute("name", v)}
            />
          </Grid>
          <Grid size={GRID_ITEM_SIZE} className="item">
            <Contributions
              contributionKey={
                CONTRIBUTIONPLAN_CALCULATIONRULE_CONTRIBUTION_KEY
              }
              label={formatMessage(intl, "contributionPlan", "calculation")}
              value={!!calculationId ? calculationId : null}
              onChange={this.updateAttribute}
              required
            />
          </Grid>
          <Grid size={GRID_ITEM_SIZE} className="item">
            <PublishedComponent
              pubRef="product.ProductPicker"
              withNull={true}
              label={formatMessage(intl, "contributionPlan", "benefitPlan")}
              required
              value={
                !!contributionPlan.product ? contributionPlan.product : null
              }
              onChange={(v) => this.updateAttribute("benefitPlan", v)}
            />
          </Grid>
          <Grid size={GRID_ITEM_SIZE} className="item">
            <NumberInput
              module="contributionPlan"
              label="periodicity"
              required
              /**
               * @see min set to @see EMPTY_PERIODICITY_FILTER when filter unset to avoid @see NumberInput error message
               */
              min={
                !!contributionPlan.periodicity
                  ? MIN_PERIODICITY_VALUE
                  : EMPTY_PERIODICITY_VALUE
              }
              max={MAX_PERIODICITY_VALUE}
              value={
                !!contributionPlan.periodicity
                  ? contributionPlan.periodicity
                  : null
              }
              onChange={(v) => this.updateAttribute("periodicity", v)}
            />
          </Grid>
          <Grid size={GRID_ITEM_SIZE} className="item">
            <PublishedComponent
              pubRef="core.DatePicker"
              module="contributionPlan"
              label="dateValidFrom"
              required
              value={
                !!contributionPlan.dateValidFrom
                  ? contributionPlan.dateValidFrom
                  : null
              }
              onChange={(v) => this.updateAttribute("dateValidFrom", v)}
            />
          </Grid>
          <Grid size={GRID_ITEM_SIZE} className="item">
            <PublishedComponent
              pubRef="core.DatePicker"
              module="contributionPlan"
              label="dateValidTo"
              value={
                !!contributionPlan.dateValidTo
                  ? contributionPlan.dateValidTo
                  : null
              }
              onChange={(v) => this.updateAttribute("dateValidTo", v)}
            />
          </Grid>
        </Grid>
        <Divider />
        <Fragment>
          <div className="item">
            <FormattedMessage
              module="contributionPlan"
              id="calculationParams"
            />
          </div>
          <Divider />
          <Grid container className="item">
            <Contributions
              contributionKey={CONTRIBUTIONPLAN_CALCULATION_CONTRIBUTION_KEY}
              intl={intl}
              className={CONTRIBUTIONPLAN_CLASSNAME}
              entity={contributionPlan}
              requiredRights={[
                !!contributionPlan.id
                  ? RIGHT_CALCULATION_UPDATE
                  : RIGHT_CALCULATION_WRITE,
              ]}
              value={
                !!contributionPlan.jsonExt ? contributionPlan.jsonExt : null
              }
              onChange={this.updateAttribute}
              gridItemStyle="item"
              gridItemSize={GRID_ITEM_SIZE}
              setJsonExtValid={setJsonExtValid}
            />
          </Grid>
        </Fragment>
      </StyledPanel>
    );
  }
}

const mapStateToProps = (store) => ({
  isCodeValid:
    store.contributionPlan?.validationFields?.contributionPlanCode?.isValid,
  isCodeValidating:
    store.contributionPlan?.validationFields?.contributionPlanCode
      ?.isValidating,
  validationError:
    store.contributionPlan?.validationFields?.contributionPlanCode
      ?.validationError,
  savedCode: store.contributionPlan?.contributionPlan?.code,
});

export { StyledPanel };
export { ContributionPlanHeadPanel };
export default withModulesManager(
  injectIntl(
    connect(
      mapStateToProps,
      null
    )(ContributionPlanHeadPanel)
  )
);
