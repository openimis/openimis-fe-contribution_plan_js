import React, { Fragment } from "react";
import { Grid, Divider, Typography } from "@material-ui/core";
import { withModulesManager, FormPanel, TextInput, FormattedMessage, PublishedComponent, NumberInput } from "@openimis/fe-core";
import { injectIntl } from "react-intl";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { EMPTY_PERIODICITY_VALUE, MIN_PERIODICITY_VALUE, MAX_PERIODICITY_VALUE } from "../constants"

const styles = theme => ({
    tableTitle: theme.table.title,
    item: theme.paper.item,
    fullHeight: {
        height: "100%"
    }
});

class ContributionPlanBundleHeadPanel extends FormPanel {
    render() {
        const { classes, edited, mandatoryFieldsEmpty } = this.props;
        return (
            <Fragment>
                <Grid container className={classes.tableTitle}>
                    <Grid item>
                        <Grid container align="center" justify="center" direction="column" className={classes.fullHeight}>
                            <Grid item>
                                <Typography >
                                    <FormattedMessage module="contributionPlan" id="contributionPlan.headPanel.title" />
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Divider />
                {mandatoryFieldsEmpty &&
                    <Fragment>
                        <div className={classes.item}>
                            <FormattedMessage module="contributionPlan" id="mandatoryFieldsEmptyError" />
                        </div>
                        <Divider />
                    </Fragment>
                }
                <Grid container className={classes.item}>
                    <Grid item xs={3} className={classes.item}>
                        <TextInput
                            module="contributionPlan"
                            label="code"
                            required
                            value={!!edited && !!edited.code ? edited.code : ""}
                            onChange={v => this.updateAttribute('code', v)}
                            readOnly={!!edited && !!edited.id ? true : false}
                        />
                    </Grid>
                    <Grid item xs={3} className={classes.item}>
                        <TextInput
                            module="contributionPlan"
                            label="name"
                            required
                            value={!!edited && !!edited.name ? edited.name : ""}
                            onChange={v => this.updateAttribute('name', v)}
                        />
                    </Grid>
                    <Grid item xs={2} className={classes.item}>
                        <NumberInput
                            module="contributionPlan"
                            label="periodicity"
                            required
                            /**
                             * @see min set to @see EMPTY_PERIODICITY_FILTER when filter unset to avoid @see NumberInput error message
                             */
                            min={!!edited && !!edited.periodicity ? MIN_PERIODICITY_VALUE : EMPTY_PERIODICITY_VALUE}
                            max={MAX_PERIODICITY_VALUE}
                            value={!!edited && !!edited.periodicity ? edited.periodicity : null}
                            onChange={v => this.updateAttribute('periodicity', v)}
                            readOnly={!!edited && !!edited.id ? true : false}
                        />
                    </Grid>
                    <Grid item xs={2} className={classes.item}>
                        <PublishedComponent
                            pubRef="core.DatePicker"
                            module="contributionPlan"
                            label="dateValidFrom"
                            required
                            value={!!edited && !!edited.dateValidFrom ? edited.dateValidFrom : null}
                            onChange={v => this.updateAttribute('dateValidFrom', v)}
                        />
                    </Grid>
                    <Grid item xs={2} className={classes.item}>
                        <PublishedComponent
                            pubRef="core.DatePicker"
                            module="contributionPlan"
                            label="dateValidTo"
                            value={!!edited && !!edited.dateValidTo ? edited.dateValidTo : null}
                            onChange={v => this.updateAttribute('dateValidTo', v)}
                        />
                    </Grid>
                </Grid>
            </Fragment>
        )
    }
}

export default withModulesManager(injectIntl(withTheme(withStyles(styles)(ContributionPlanBundleHeadPanel))))
