import React, { Component, Fragment } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import AddIcon from '@mui/icons-material/Add';
import { FormattedMessage, formatMessageWithValues, PublishedComponent } from "@openimis/fe-core";
import { Fab, Grid } from "@mui/material";
import { styled } from "@mui/material/styles";
import ContributionPlanPicker from '../pickers/ContributionPlanPicker';
import { createContributionPlanBundleContributionPlan } from "../actions";
import { injectIntl } from 'react-intl';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

const StyledDialog = styled('div')(({ theme }) => ({
  '& .item': theme.paper.item
}));

class CreateContributionPlanBundleDetailsDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            contributionPlanAttached: {}
        }
    }

    handleOpen = () => {
        this.setState({ open: true, contributionPlanAttached: { contributionPlanBundleId: this.props.contributionPlanBundleId }});
    };

    handleClose = () => {
        this.setState({ open: false, contributionPlanAttached: {} });
    };

    handleSave = () => {
        this.props.createContributionPlanBundleContributionPlan(
            this.state.contributionPlanAttached,
            formatMessageWithValues(
                this.props.intl,
                "contributionPlan",
                "CreateContributionPlanBundleDetails.mutationLabel",
                { contributionPlanBundle: this.props.contributionPlanBundle.name }
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

    canSave = () => {
        const { contributionPlanAttached } = this.state;
        return !!contributionPlanAttached.contributionPlan && !!contributionPlanAttached.dateValidFrom;
    }

    render() {
        const { disabled, contributionPlanBundle } = this.props;
        const { open, contributionPlanAttached } = this.state;
        return (
            <Fragment>
                <Fab
                    size="small"
                    color="primary"
                    disabled={disabled}
                    onClick={this.handleOpen}>
                    <AddIcon />
                </Fab>
                <Dialog open={open} onClose={this.handleClose}>
                    <DialogTitle>
                        <FormattedMessage module="contributionPlan" id="contributionPlanBundle.contributionPlansAttachedPanel.createContributionPlan" />
                    </DialogTitle>
                    <DialogContent>
                        <StyledDialog>
                            <Grid container direction="column" className="item">
                                <Grid className="item">
                                    <ContributionPlanPicker
                                        periodicity={!!contributionPlanBundle ? contributionPlanBundle.periodicity : null}
                                        withNull={true}
                                        required
                                        value={!!contributionPlanAttached.contributionPlan && contributionPlanAttached.contributionPlan}
                                        onChange={v => this.updateAttribute('contributionPlan', v)}
                                    />
                                </Grid>
                                <Grid className="item">
                                    <PublishedComponent
                                        pubRef="core.DatePicker"
                                        module="contributionPlan"
                                        label="dateValidFrom"
                                        required
                                        onChange={v => this.updateAttribute('dateValidFrom', v)}
                                    />
                                </Grid>
                                <Grid className="item">
                                    <PublishedComponent
                                        pubRef="core.DatePicker"
                                        module="contributionPlan"
                                        label="dateValidTo"
                                        onChange={v => this.updateAttribute('dateValidTo', v)}
                                    />
                                </Grid>
                            </Grid>
                        </StyledDialog>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} variant="outlined">
                            <FormattedMessage module="contributionPlan" id="contributionPlanBundle.contributionPlansAttachedPanel.dialog.cancel" />
                        </Button>
                        <Button onClick={this.handleSave} disabled={!this.canSave()} variant="contained" color="primary" autoFocus>
                            <FormattedMessage module="contributionPlan" id="contributionPlanBundle.contributionPlansAttachedPanel.dialog.create" />
                        </Button>
                    </DialogActions>
                </Dialog>
            </Fragment>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ createContributionPlanBundleContributionPlan }, dispatch);
};

export { StyledDialog };
export default injectIntl(connect(null, mapDispatchToProps)(CreateContributionPlanBundleDetailsDialog));
