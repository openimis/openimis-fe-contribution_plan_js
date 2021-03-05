# openIMIS Frontend Contribution Plan reference module
This repository holds the files of the openIMIS Frontend Contribution Plan reference module.
It is dedicated to be deployed as a module of [openimis-fe_js](https://github.com/openimis/openimis-fe_js).

[![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)

## Main Menu Contributions
None

## Other Contributions
* `core.Router`: registering `contributionPlans`, `contributionPlans/contributionPlan`, `contributionPlanBundles`, `contributionPlanBundles/contributionPlanBundle` routes in openIMIS client-side router
* `admin.MainMenu`:

   **Contribution Plan** (`contributionPlan.contributionPlan.label` translation key), pointing to `/contributionPlans`
   
   **Contribution Plan Bundle** (`contributionPlan.contributionPlanBundle.label` translation key), pointing to `/contributionPlanBundles`

## Available Contribution Points
None

## Published Components
None

## Dispatched Redux Actions
* `CONTRIBUTIONPLAN_CONTRIBUTIONPLANS_{REQ|RESP|ERR}`, fetching Contribution Plans (as triggered by the searcher)
* `CONTRIBUTIONPLAN_CONTRIBUTIONPLAN_{REQ|RESP|ERR}`, fetching Contribution Plan
* `CONTRIBUTIONPLAN_CONTRIBUTIONPLANBUNDLES_{REQ|RESP|ERR}`, fetching Contribution Plan Bundles (as triggered by the searcher)
* `CONTRIBUTIONPLAN_CONTRIBUTIONPLANBUNDLE_{REQ|RESP|ERR}`, fetching Contribution Plan Bundle
* `CONTRIBUTIONPLAN_CONTRIBUTIONPLANBUNDLEDETAILS_{REQ|RESP|ERR}`, fetching Contribution Plan Bundle Contribution Plans (as triggered by the searcher)
* `CONTRIBUTIONPLAN_MUTATION_{REQ|ERR}`, sending a mutation
* `CONTRIBUTIONPLAN_CREATE_CONTRIBUTIONPLAN_RESP`, receiving a result of create Contribution Plan mutation
* `CONTRIBUTIONPLAN_UPDATE_CONTRIBUTIONPLAN_RESP`, receiving a result of update Contribution Plan mutation
* `CONTRIBUTIONPLAN_DELETE_CONTRIBUTIONPLAN_RESP`, receiving a result of delete Contribution Plan mutation
* `CONTRIBUTIONPLAN_CREATE_CONTRIBUTIONPLANBUNDLE_RESP`, receiving a result of create Contribution Plan Bundle mutation
* `CONTRIBUTIONPLAN_UPDATE_CONTRIBUTIONPLANBUNDLE_RESP`, receiving a result of update Contribution Plan Bundle mutation
* `CONTRIBUTIONPLAN_CREATE_CONTRIBUTIONPLANBUNDLEDETAILS_RESP`, receiving a result of create Contribution Plan Bundle Contribution Plan mutation
* `CONTRIBUTIONPLAN_UPDATE_CONTRIBUTIONPLANBUNDLEDETAILS_RESP`, receiving a result of update Contribution Plan Bundle Contribution Plan mutation
* `CONTRIBUTIONPLAN_DELETE_CONTRIBUTIONPLANBUNDLEDETAILS_RESP`, receiving a result of delete Contribution Plan Bundle Contribution Plan mutation

## Other Modules Listened Redux Actions
None

## Other Modules Redux State Bindings
* `state.core.user`, to access user info (rights, ...)
* `state.core.confirmed`, to call action of a confirmed dialog (e.g. confirm delete operation)
