import React, { Component, Fragment } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import EditIcon from '@material-ui/icons/Edit';
import NoteAddIcon from '@material-ui/icons/NoteAdd';
import { FormattedMessage, formatMessage, formatMessageWithValues, PublishedComponent } from "@openimis/fe-core";
import { Tooltip, Grid, IconButton } from "@material-ui/core";
import { withTheme, withStyles } from "@material-ui/core/styles";
import ContributionPlanPicker from '../pickers/ContributionPlanPicker';
import { updateContributionPlanBundleContributionPlan, replaceContributionPlanBundleContributionPlan } from "../actions";
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
        this.setState({
            open: true,
            contributionPlanAttached: {
                ...this.props.contributionPlanBundleContributionPlan,
                contributionPlan: this.props.contributionPlanBundleContributionPlan.contributionPlan
            }
        });
    };

    handleClose = () => {
        this.setState({ open: false, contributionPlanAttached: {} });
    };

    handleSave = () => {
        const { intl, replaceContributionPlanBundleContributionPlan, updateContributionPlanBundleContributionPlan,
            contributionPlanBundleContributionPlan, isReplacing = false } = this.props;
        if (isReplacing) {
            replaceContributionPlanBundleContributionPlan(
                this.state.contributionPlanAttached,
                formatMessageWithValues(
                    intl,
                    "contributionPlan",
                    "ReplaceContributionPlanBundleDetails.mutationLabel",
                    {
                        contributionPlan: contributionPlanBundleContributionPlan.contributionPlan.name,
                        contributionPlanBundle: contributionPlanBundleContributionPlan.contributionPlanBundle.name
                    }
                )
            );
        } else {
            updateContributionPlanBundleContributionPlan(
                this.state.contributionPlanAttached,
                formatMessageWithValues(
                    intl,
                    "contributionPlan",
                    "UpdateContributionPlanBundleDetails.mutationLabel",
                    {
                        contributionPlan: contributionPlanBundleContributionPlan.contributionPlan.name,
                        contributionPlanBundle: contributionPlanBundleContributionPlan.contributionPlanBundle.name
                    }
                )
            );
        }
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
        const { intl, classes, contributionPlanBundle, isReplacing = false, disabled = false } = this.props;
        const { open, contributionPlanAttached } = this.state;
        return (
            <Fragment>
                {isReplacing ? (
                    <Tooltip title={formatMessage(intl, "contributionPlan", "replaceButton.tooltip")}>
                        <div>
                            <IconButton
                                onClick={this.handleOpen}
                                disabled={disabled}>
                                <NoteAddIcon />
                            </IconButton>
                        </div>
                    </Tooltip>
                ) : (
                    <Tooltip title={formatMessage(intl, "contributionPlan", "editButton.tooltip")}>
                        <div>
                            <IconButton
                                onClick={this.handleOpen}
                                disabled={disabled}>
                                <EditIcon />
                            </IconButton>
                        </div>
                    </Tooltip>
                )}
                <Dialog open={open} onClose={this.handleClose}>
                    <DialogTitle>
                        {isReplacing ? (
                            <FormattedMessage module="contributionPlan" id="contributionPlanBundle.contributionPlansAttachedPanel.replaceContributionPlan" />
                        ) : (
                            <FormattedMessage module="contributionPlan" id="contributionPlanBundle.contributionPlansAttachedPanel.editContributionPlan" />
                        )}
                    </DialogTitle>
                    <DialogContent>
                        <Grid container direction="column" className={classes.item}>
                            <Grid item xs={12} className={classes.item}>
                                <ContributionPlanPicker
                                    periodicity={!!contributionPlanBundle ? contributionPlanBundle.periodicity : null}
                                    value={contributionPlanAttached.contributionPlan}
                                    onChange={v => this.updateAttribute('contributionPlan', v)}
                                    readOnly={!isReplacing}
                                />
                            </Grid>
                            <Grid item xs={12} className={classes.item}>
                                <PublishedComponent
                                    pubRef="core.DatePicker"
                                    module="contributionPlan"
                                    label="dateValidFrom"
                                    value={contributionPlanAttached.dateValidFrom}
                                    onChange={v => this.updateAttribute('dateValidFrom', v)}
                                    readOnly={!isReplacing}
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
                            {isReplacing ? (
                                <FormattedMessage module="contributionPlan" id="contributionPlanBundle.contributionPlansAttachedPanel.dialog.replace" />
                            ) : (
                                <FormattedMessage module="contributionPlan" id="contributionPlanBundle.contributionPlansAttachedPanel.dialog.update" />
                            )}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Fragment>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ updateContributionPlanBundleContributionPlan, replaceContributionPlanBundleContributionPlan }, dispatch);
};

export default injectIntl(withTheme(withStyles(styles)(connect(null, mapDispatchToProps)(UpdateContributionPlanBundleDetailsDialog))));
