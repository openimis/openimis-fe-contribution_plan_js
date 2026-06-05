import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';

import { Grid, Divider, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import {
  withModulesManager,
  FormPanel,
  TextInput,
  FormattedMessage,
  PublishedComponent,
  NumberInput,
  ValidatedTextInput,
  GRID_RESPONSIVE_STANDARD,
} from '@openimis/fe-core';
import {
  contributionPlanBundleCodeValidation,
  contributionPlanBundleCodeClear,
  contributionPlanBundleCodeSetValid,
} from '../actions';
import {
  EMPTY_PERIODICITY_VALUE,
  MIN_PERIODICITY_VALUE,
  MAX_PERIODICITY_VALUE,
} from '../constants';

const StyledGrid = styled(Grid)(({ theme }) => ({
  '& .tableTitle': theme.table?.title ?? {},
  '& .item': theme.paper?.item ?? {},
  '& .fullHeight': {
    height: '100%',
  },
}));

class ContributionPlanBundleHeadPanel extends FormPanel {
  shouldValidate = (input) => {
    const { savedCode } = this.props;
    return input !== savedCode;
  };

  render() {
    const {
      edited,
      mandatoryFieldsEmpty,
      isReplacing,
      isCodeValid,
      isCodeValidating,
      validationError,
    } = this.props;
    return (
      <Fragment>
        <StyledGrid container className='item'>
          <Grid size={12} className='item'>
            <Typography variant='h6'>
              <FormattedMessage
                module='contributionPlan'
                id='contributionPlan.headPanel.title'
              />
            </Typography>
          </Grid>
        </StyledGrid>
        <Divider />
        {mandatoryFieldsEmpty && (
          <Fragment>
            <div className='item'>
              <FormattedMessage
                module='contributionPlan'
                id='mandatoryFieldsEmptyError'
              />
            </div>
            <Divider />
          </Fragment>
        )}
        <StyledGrid container className='item'>
          <Grid size={GRID_RESPONSIVE_STANDARD} className='item'>
            <ValidatedTextInput
              itemQueryIdentifier='contributionPlanBundleCode'
              codeTakenLabel='contributionPlan.bundleCodeTaken'
              shouldValidate={this.shouldValidate}
              isValid={isCodeValid}
              isValidating={isCodeValidating}
              validationError={validationError}
              action={contributionPlanBundleCodeValidation}
              clearAction={contributionPlanBundleCodeClear}
              setValidAction={contributionPlanBundleCodeSetValid}
              module='contributionPlan'
              required={true}
              label='code'
              value={!!edited && !!edited.code ? edited.code : ''}
              onChange={(v) => this.updateAttribute('code', v)}
              readOnly={!!edited && !!edited.id ? true : false}
            />
          </Grid>
          <Grid size={GRID_RESPONSIVE_STANDARD} className='item'>
            <TextInput
              module='contributionPlan'
              label='name'
              required
              value={!!edited && !!edited.name ? edited.name : ''}
              onChange={(v) => this.updateAttribute('name', v)}
            />
          </Grid>
          <Grid size={GRID_RESPONSIVE_STANDARD} className='item'>
            <NumberInput
              module='contributionPlan'
              label='periodicity'
              required
              /**
               * @see min set to @see EMPTY_PERIODICITY_FILTER when filter unset to avoid @see NumberInput error message
               */
              min={
                !!edited && !!edited.periodicity
                  ? MIN_PERIODICITY_VALUE
                  : EMPTY_PERIODICITY_VALUE
              }
              max={MAX_PERIODICITY_VALUE}
              value={
                !!edited && !!edited.periodicity ? edited.periodicity : null
              }
              onChange={(v) => this.updateAttribute('periodicity', v)}
              readOnly={!isReplacing && !!edited && !!edited.id ? true : false}
            />
          </Grid>
          <Grid size={GRID_RESPONSIVE_STANDARD} className='item'>
            <PublishedComponent
              pubRef='core.DatePicker'
              module='contributionPlan'
              label='dateValidFrom'
              required
              value={
                !!edited && !!edited.dateValidFrom ? edited.dateValidFrom : null
              }
              onChange={(v) => this.updateAttribute('dateValidFrom', v)}
            />
          </Grid>
          <Grid size={GRID_RESPONSIVE_STANDARD} className='item'>
            <PublishedComponent
              pubRef='core.DatePicker'
              module='contributionPlan'
              label='dateValidTo'
              value={
                !!edited && !!edited.dateValidTo ? edited.dateValidTo : null
              }
              onChange={(v) => this.updateAttribute('dateValidTo', v)}
            />
          </Grid>
        </StyledGrid>
      </Fragment>
    );
  }
}

const mapStateToProps = (store) => ({
  isCodeValid:
    store.contributionPlan?.validationFields?.contributionPlanBundleCode
      ?.isValid,
  isCodeValidating:
    store.contributionPlan?.validationFields?.contributionPlanBundleCode
      ?.isValidating,
  validationError:
    store.contributionPlan?.validationFields?.contributionPlanBundleCode
      ?.validationError,
  savedCode: store.contributionPlan?.contributionPlanBundle?.code,
});

export { StyledGrid };
export { ContributionPlanBundleHeadPanel };
export default withModulesManager(
  injectIntl(connect(mapStateToProps, null)(ContributionPlanBundleHeadPanel)),
);
