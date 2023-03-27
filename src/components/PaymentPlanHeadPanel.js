import React, { Fragment } from "react";
import { Grid, Divider, Typography } from "@material-ui/core";
import {
    withModulesManager,
    formatMessage,
    FormPanel,
    TextInput,
    FormattedMessage,
    PublishedComponent,
    NumberInput,
    Contributions
} from "@openimis/fe-core";
import { injectIntl } from "react-intl";
import { withTheme, withStyles } from "@material-ui/core/styles";
import {
    EMPTY_PERIODICITY_VALUE,
    MIN_PERIODICITY_VALUE,
    MAX_PERIODICITY_VALUE,
    CONTRIBUTIONPLAN_CALCULATION_CONTRIBUTION_KEY,
    CONTRIBUTIONPLAN_CALCULATIONRULE_CONTRIBUTION_KEY,
    PAYMENTPLAN_CLASSNAME,
    RIGHT_CALCULATION_WRITE,
    RIGHT_CALCULATION_UPDATE
} from "../constants";

const styles = theme => ({
    tableTitle: theme.table.title,
    item: theme.paper.item,
    fullHeight: {
        height: "100%"
    }
});

const GRID_ITEM_SIZE = 3;

class PaymentPlanHeadPanel extends FormPanel {
    render() {
        const { intl, classes, mandatoryFieldsEmpty, setJsonExtValid, setRequiredValid } = this.props;
        const { benefitPlan: product, calculation: calculationId, ...others } = this.props.edited;
        const calculation = !!calculationId ? { id: calculationId } : null;
        const paymentPlan = { product, calculation, ...others };
        return (
            <Fragment>
                <Grid container className={classes.tableTitle}>
                    <Grid item>
                        <Grid
                            container
                            align="center"
                            justify="center"
                            direction="column"
                            className={classes.fullHeight}
                        >
                            <Grid item>
                                <Typography>
                                    <FormattedMessage module="contributionPlan" id="paymentPlan.headPanel.title" />
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Divider />
                {mandatoryFieldsEmpty && (
                    <Fragment>
                        <div className={classes.item}>
                            <FormattedMessage module="contributionPlan" id="mandatoryFieldsEmptyError" />
                        </div>
                        <Divider />
                    </Fragment>
                )}
                <Grid container className={classes.item}>
                    <Grid item xs={GRID_ITEM_SIZE} className={classes.item}>
                        <TextInput
                            module="contributionPlan"
                            label="code"
                            required
                            value={!!paymentPlan.code ? paymentPlan.code : ""}
                            onChange={(v) => this.updateAttribute("code", v)}
                            readOnly={!!paymentPlan.id}
                        />
                    </Grid>
                    <Grid item xs={GRID_ITEM_SIZE} className={classes.item}>
                        <TextInput
                            module="contributionPlan"
                            label="name"
                            required
                            value={!!paymentPlan.name ? paymentPlan.name : ""}
                            onChange={(v) => this.updateAttribute("name", v)}
                        />
                    </Grid>
                    <Grid item xs={GRID_ITEM_SIZE} className={classes.item}>
                        <Contributions
                            contributionKey={CONTRIBUTIONPLAN_CALCULATIONRULE_CONTRIBUTION_KEY}
                            label={formatMessage(intl, "paymentPlan", "calculation")}
                            value={!!calculationId ? calculationId : null}
                            onChange={this.updateAttribute}
                            required
                        />
                    </Grid>
                    <Grid item xs={GRID_ITEM_SIZE} className={classes.item}>
                        <PublishedComponent
                            pubRef="product.ProductPicker"
                            withNull={true}
                            label={formatMessage(intl, "paymentPlan", "benefitPlan")}
                            required
                            value={!!paymentPlan.product ? paymentPlan.product : null}
                            onChange={(v) => this.updateAttribute("benefitPlan", v)}
                        />
                    </Grid>
                    <Grid item xs={GRID_ITEM_SIZE} className={classes.item}>
                        <NumberInput
                            module="contributionPlan"
                            label="periodicity"
                            required
                            /**
                             * @see min set to @see EMPTY_PERIODICITY_FILTER when filter unset to avoid @see NumberInput error message
                             */
                            min={!!paymentPlan.periodicity ? MIN_PERIODICITY_VALUE : EMPTY_PERIODICITY_VALUE}
                            max={MAX_PERIODICITY_VALUE}
                            value={!!paymentPlan.periodicity ? paymentPlan.periodicity : null}
                            onChange={(v) => this.updateAttribute("periodicity", v)}
                        />
                    </Grid>
                    <Grid item xs={GRID_ITEM_SIZE} className={classes.item}>
                        <PublishedComponent
                            pubRef="core.DatePicker"
                            module="contributionPlan"
                            label="dateValidFrom"
                            required
                            value={!!paymentPlan.dateValidFrom ? paymentPlan.dateValidFrom : null}
                            onChange={(v) => this.updateAttribute("dateValidFrom", v)}
                        />
                    </Grid>
                    <Grid item xs={GRID_ITEM_SIZE} className={classes.item}>
                        <PublishedComponent
                            pubRef="core.DatePicker"
                            module="contributionPlan"
                            label="dateValidTo"
                            value={!!paymentPlan.dateValidTo ? paymentPlan.dateValidTo : null}
                            onChange={(v) => this.updateAttribute("dateValidTo", v)}
                        />
                    </Grid>
                </Grid>
                <Divider />
                <Fragment>
                    <div className={classes.item}>
                        <FormattedMessage module="contributionPlan" id="calculationParams" />
                    </div>
                    <Divider />
                    <Grid container className={classes.item}>
                        <Contributions
                            contributionKey={CONTRIBUTIONPLAN_CALCULATION_CONTRIBUTION_KEY}
                            intl={intl}
                            className={PAYMENTPLAN_CLASSNAME}
                            entity={paymentPlan}
                            requiredRights={[!!paymentPlan.id ? RIGHT_CALCULATION_UPDATE : RIGHT_CALCULATION_WRITE]}
                            value={!!paymentPlan.jsonExt ? paymentPlan.jsonExt : null}
                            onChange={this.updateAttribute}
                            gridItemStyle={classes.item}
                            gridItemSize={GRID_ITEM_SIZE}
                            setRequiredValid={setRequiredValid}
                            setJsonExtValid={setJsonExtValid}
                            periodicity={!!paymentPlan.periodicity ? paymentPlan.periodicity : null}
                        />
                    </Grid>
                </Fragment>
            </Fragment>
        );
    }
}

export default withModulesManager(injectIntl(withTheme(withStyles(styles)(PaymentPlanHeadPanel))))
