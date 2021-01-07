import React, { Component, Fragment } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import EditIcon from '@material-ui/icons/Edit';
import {FormattedMessage, formatMessage, formatMessageWithValues, PublishedComponent, decodeId } from "@openimis/fe-core";
import { Tooltip, Grid, IconButton } from "@material-ui/core";
import { withTheme, withStyles } from "@material-ui/core/styles";
import ContributionPlanPicker from '../pickers/ContributionPlanPicker';
import { updateContributionPlanBundleContributionPlan } from "../actions";
import { injectIntl } from 'react-intl';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

const styles = theme => ({
    item: theme.paper.item
});

class UpdateContributionPlanBundleDetailsDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            contributionPlanAttached: {}
        }
    }

    handleOpen = () => {
        this.setState({ open: true, contributionPlanAttached: this.props.contributionPlanBundleContributionPlan });
    };

    handleClose = () => {
        this.setState({ open: false, contributionPlanAttached: {} });
    };

    handleSave = () => {
        this.props.updateContributionPlanBundleContributionPlan(
            this.state.contributionPlanAttached,
            formatMessageWithValues(
                this.props.intl,
                "contributionPlan",
                "UpdateContributionPlanBundleDetails.mutationLabel",
                {
                    contributionPlan: this.props.contributionPlanBundleContributionPlan.contributionPlan.name,
                    contributionPlanBundle: this.props.contributionPlanBundleContributionPlan.contributionPlanBundle.name
                }
            )
        );
        this.handleClose();
    };

    updateAttribute = (attribute, value) => {
        this.setState(state => ({
            contributionPlanAttached: {
                ...state.contributionPlanAttached,
                [attribute]: value
            }
        }));
    }

    render() {
        const { intl, classes, contributionPlanBundle } = this.props;
        const { open, contributionPlanAttached } = this.state;
        return (
            <Fragment>
                <Tooltip title={formatMessage(intl, "contributionPlan", "editButton.tooltip")}>
                    <IconButton
                        onClick={this.handleOpen}>
                        <EditIcon />
                    </IconButton>
                </Tooltip>
                <Dialog open={open} onClose={this.handleClose}>
                    <DialogTitle>
                        <FormattedMessage module="contributionPlan" id="contributionPlanBundle.contributionPlansAttachedPanel.editContributionPlan" />
                    </DialogTitle>
                    <DialogContent>
                        <Grid container direction="column" className={classes.item}>
                            <Grid item xs={12} className={classes.item}>
                                <ContributionPlanPicker
                                    periodicity={!!contributionPlanBundle ? contributionPlanBundle.periodicity : null}
                                    value={!!contributionPlanAttached.contributionPlan && decodeId(contributionPlanAttached.contributionPlan.id)}
                                    readOnly
                                />
                            </Grid>
                            <Grid item xs={12} className={classes.item}>
                                <PublishedComponent
                                    pubRef="core.DatePicker"
                                    module="contributionPlan"
                                    label="dateValidFrom"
                                    value={contributionPlanAttached.dateValidFrom}
                                    readOnly
                                />
                            </Grid>
                            <Grid item xs={12} className={classes.item}>
                                <PublishedComponent
                                    pubRef="core.DatePicker"
                                    module="contributionPlan"
                                    label="dateValidTo"
                                    value={contributionPlanAttached.dateValidTo}
                                    onChange={v => this.updateAttribute('dateValidTo', v)}
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} variant="outlined">
                            <FormattedMessage module="contributionPlan" id="contributionPlanBundle.contributionPlansAttachedPanel.dialog.cancel" />
                        </Button>
                        <Button onClick={this.handleSave} variant="contained" color="primary" autoFocus>
                            <FormattedMessage module="contributionPlan" id="contributionPlanBundle.contributionPlansAttachedPanel.dialog.update" />
                        </Button>
                    </DialogActions>
                </Dialog>
            </Fragment>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ updateContributionPlanBundleContributionPlan }, dispatch);
};

export default injectIntl(withTheme(withStyles(styles)(connect(_, mapDispatchToProps)(UpdateContributionPlanBundleDetailsDialog))));
