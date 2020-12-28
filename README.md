# openIMIS Frontend Contribution Plan reference module
This repository holds the files of the openIMIS Frontend Contribution Plan reference module.
It is dedicated to be deployed as a module of [openimis-fe_js](https://github.com/openimis/openimis-fe_js).

[![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)

## Main Menu Contributions
None

## Other Contributions
* `core.Router`: registering `contributionPlans`, `contributionPlans/contributionPlan`, `contributionPlanBundles` routes in openIMIS client-side router

## Available Contribution Points
None

## Published Components
None

## Dispatched Redux Actions
* `CONTRIBUTIONPLAN_CONTRIBUTIONPLANS_{REQ|RESP|ERR}`, fetching Contribution Plans (as triggered by the searcher)
* `CONTRIBUTIONPLAN_CONTRIBUTIONPLAN_{REQ|RESP|ERR}`, fetching Contribution Plan
* `CONTRIBUTIONPLAN_CONTRIBUTIONPLANBUNDLES_{REQ|RESP|ERR}`, fetching Contribution Plan Bundles (as triggered by the searcher)
* `CONTRIBUTIONPLAN_MUTATION_{REQ|ERR}`, sending a mutation
* `CONTRIBUTIONPLAN_CREATE_CONTRIBUTIONPLAN_RESP`, receiving a result of create Contribution Plan mutation
* `CONTRIBUTIONPLAN_UPDATE_CONTRIBUTIONPLAN_RESP`, receiving a result of update Contribution Plan mutation
* `CONTRIBUTIONPLAN_DELETE_CONTRIBUTIONPLAN_RESP`, receiving a result of delete Contribution Plan mutation

## Other Modules Listened Redux Actions
* `PRODUCT_PRODUCT_PICKER_RESP`, fetching products

## Other Modules Redux State Bindings
* `state.core.user`, to access user info (rights,...)
