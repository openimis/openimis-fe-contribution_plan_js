import React, { Component } from "react";
import { injectIntl } from "react-intl";

import { Grid, FormControlLabel, Checkbox } from "@material-ui/core";
import { withTheme, withStyles } from "@material-ui/core/styles";

import {
  withModulesManager,
  formatMessage,
  TextInput,
  NumberInput,
  PublishedComponent,
} from "@openimis/fe-core";
import {
  DATE_TO_DATETIME_SUFFIX,
  GREATER_OR_EQUAL_LOOKUP,
  LESS_OR_EQUAL_LOOKUP,
  CONTAINS_LOOKUP,
  EMPTY_PERIODICITY_VALUE,
  MIN_PERIODICITY_VALUE,
  MAX_PERIODICITY_VALUE,
} from "../constants";

const styles = (theme) => ({
  form: {
    padding: 0,
  },
  item: {
    padding: theme.spacing(1),
  },
});

class ContributionPlanFilter extends Component {
  _filterValue = (k) => {
    const { filters } = this.props;
    return !!filters[k] ? filters[k].value : null;
  };

  _filterTextFieldValue = (k) => {
    const { filters } = this.props;
    return !!filters[k] ? filters[k].value : "";
  };

  _onChangeFilter = (k, v) => {
    this.props.onChangeFilters([
      {
        id: k,
        value: v,
        filter: `${k}: ${v}`,
      },
    ]);
  };

  _onChangeStringFilter = (k, v, lookup) => {
    this.props.onChangeFilters([
      {
        id: k,
        value: v,
        filter: `${k}_${lookup}: "${v}"`,
      },
    ]);
  };

  _onChangeDateFilter = (k, v, lookup) => {
    this.props.onChangeFilters([
      {
        id: k,
        value: v,
        filter: `${k}_${lookup}: "${v}${DATE_TO_DATETIME_SUFFIX}"`,
      },
    ]);
  };

  render() {
    const { intl, classes } = this.props;
    return (
      <Grid container className={classes.form}>
        <Grid item xs={2} className={classes.item}>
          <TextInput
            module="contributionPlan"
            label="code"
            value={this._filterTextFieldValue("code")}
            onChange={(v) =>
              this._onChangeStringFilter("code", v, CONTAINS_LOOKUP)
            }
          />
        </Grid>
        <Grid item xs={2} className={classes.item}>
          <TextInput
            module="contributionPlan"
            label="name"
            value={this._filterTextFieldValue("name")}
            onChange={(v) =>
              this._onChangeStringFilter("name", v, CONTAINS_LOOKUP)
            }
          />
        </Grid>
        <Grid item xs={2} className={classes.item}>
          <NumberInput
            module="contributionPlan"
            label="periodicity"
            /**
             * @see min set to @see EMPTY_PERIODICITY_VALUE when filter unset to avoid @see NumberInput error message
             */
            min={
              !!this._filterValue("periodicity")
                ? MIN_PERIODICITY_VALUE
                : EMPTY_PERIODICITY_VALUE
            }
            max={MAX_PERIODICITY_VALUE}
            value={this._filterValue("periodicity")}
            onChange={(v) =>
              this._onChangeFilter("periodicity", !!v ? v : null)
            }
          />
        </Grid>
        <Grid item xs={2} className={classes.item}>
          <PublishedComponent
            pubRef="core.DatePicker"
            module="contributionPlan"
            label="dateValidFrom"
            value={this._filterValue("dateValidFrom")}
            onChange={(v) =>
              this._onChangeDateFilter(
                "dateValidFrom",
                v,
                GREATER_OR_EQUAL_LOOKUP
              )
            }
          />
        </Grid>
        <Grid item xs={2} className={classes.item}>
          <PublishedComponent
            pubRef="core.DatePicker"
            module="contributionPlan"
            label="dateValidTo"
            value={this._filterValue("dateValidTo")}
            onChange={(v) =>
              this._onChangeDateFilter("dateValidTo", v, LESS_OR_EQUAL_LOOKUP)
            }
          />
        </Grid>
        <Grid item xs={2} className={classes.item}>
          <FormControlLabel
            control={
              <Checkbox
                checked={!!this._filterValue("isDeleted")}
                onChange={(event) =>
                  this._onChangeFilter("isDeleted", event.target.checked)
                }
                name="isDeleted"
              />
            }
            label={formatMessage(intl, "contributionPlan", "isDeleted")}
          />
        </Grid>
        <Grid item xs={2} className={classes.item}>
          <FormControlLabel
            control={
              <Checkbox
                checked={!!this._filterValue("showHistory")}
                onChange={(event) =>
                  this._onChangeFilter("showHistory", event.target.checked)
                }
                name="isDeleted"
              />
            }
            label={formatMessage(intl, "contributionPlan", "showHistory")}
          />
        </Grid>
      </Grid>
    );
  }
}

export default withModulesManager(
  injectIntl(withTheme(withStyles(styles)(ContributionPlanFilter)))
);
