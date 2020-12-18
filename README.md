# openIMIS Frontend Contribution Plan reference module
This repository holds the files of the openIMIS Frontend Contribution Plan reference module.
It is dedicated to be deployed as a module of [openimis-fe_js](https://github.com/openimis/openimis-fe_js).

[![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)

## Main Menu Contributions
None

## Other Contributions
* `core.Router`: registering `contributionPlan/contributionPlans` route in openIMIS client-side router

## Available Contribution Points
None

## Published Components
None

## Dispatched Redux Actions
* `CONTRIBUTIONPLAN_CONTRIBUTIONPLANS_{REQ|RESP|ERR}`, fetching contribution plans (as triggered by the searcher)

## Other Modules Listened Redux Actions
None

## Other Modules Redux State Bindings
* `state.core.user`, to access user info (rights,...)