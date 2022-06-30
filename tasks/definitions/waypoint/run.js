const { getBrowsers } = require('HerkinSC')
const { testTypes } = require('../../constants')
const { dockerCmd, sharedOptions } = require('@keg-hub/cli-utils')
const { runCommands } = require('HerkinTasks/utils/helpers/runCommands')
const { buildJestArgs } = require('HerkinTasks/utils/jest/buildJestArgs')
const { getJestConfig } = require('HerkinTasks/utils/jest/getJestConfig')
const { buildReportPath } = require('HerkinTest/reports/buildReportPath')
const { filterTaskEnvs } = require('HerkinTasks/utils/envs/filterTaskEnvs')
const { handleTestExit } = require('HerkinTasks/utils/helpers/handleTestExit')
const { buildWaypointEnvs } = require('HerkinTasks/utils/envs/buildWaypointEnvs')

/**
 * Run task for waypoint scripts
 * node ./tasks/runTask.js waypoint run context=/keg/repos/lancetipton/current/herkin/waypoint/first.waypoint.js
 */
const runWp = async args => {
  filterTaskEnvs()
  const { params, herkin } = args
  const browsers = getBrowsers(params)
  const jestConfig = await getJestConfig(params, testTypes.waypoint)
  const reportPath = buildReportPath(testTypes.waypoint, params.context, herkin)

  const cmdArgs = buildJestArgs(params, jestConfig)

  const commands = browsers.map(
    browser => () => (
      dockerCmd(
        params.container,
        cmdArgs,
        buildWaypointEnvs(browser, params, reportPath, testTypes.waypoint),
      )
    )
  )

  // Run the commands for each browser
  const codes = await runCommands(commands, params)

  // Calculate the exit codes so we know if all runs were successful
  return handleTestExit(codes)
}

module.exports = {
  run: {
    name: 'run',
    action: runWp,
    example: 'yarn test:run',
    description: 'Runs all or defined QAWolf tests',
    alias: ['test'],
    options: sharedOptions(
      'run',
      {},
      [
        'context',
        'browsers',
        'allBrowsers',
        'chromium',
        'firefox',
        'webkit',
        'headless',
        'slowMo',
        'browserTimeout',
        'debug',
        'devtools',
        'log',
        'mode',
        'base',
        'repo',
        'sync',
        'container',
        'device',
        'width',
        'height',
        'appUrl',
        'downloads',
        'geolocation',
        'hasTouch',
        'isMobile',
        'permissions',
        `tracing`,
        'record',
        'storageState',
        'timezone',
      ]
    ),
  },
}
