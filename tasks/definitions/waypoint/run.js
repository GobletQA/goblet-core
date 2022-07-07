const { getBrowsers } = require('HerkinSC')
const { testTypes } = require('../../constants')
const { sharedOptions } = require('@keg-hub/cli-utils')
const { runTestCmd } = require('HerkinTasks/utils/helpers/runTestCmd')
const { buildJestArgs } = require('HerkinTasks/utils/jest/buildJestArgs')
const { getJestConfig } = require('HerkinTasks/utils/jest/getJestConfig')
const { buildReportPath } = require('HerkinTest/reports/buildReportPath')
const { filterTaskEnvs } = require('HerkinTasks/utils/envs/filterTaskEnvs')
const { buildWaypointEnvs } = require('HerkinTasks/utils/envs/buildWaypointEnvs')

/**
 * Run task for waypoint scripts
 * node ./tasks/runTask.js waypoint run context=/keg/repos/lancetipton/current/herkin/waypoint/first.waypoint.js
 */
const runWp = async args => {
  filterTaskEnvs()
  const { params, herkin } = args
  const jestConfig = await getJestConfig(params, testTypes.waypoint)
  const reportPath = buildReportPath(testTypes.waypoint, params, herkin)
  
  // Run the test command for defined browsers
  const exitCode = await runTestCmd({
    params,
    reportPath,
    cmdArgs: buildJestArgs(params, jestConfig),
    envsHelper: browser => buildWaypointEnvs(browser, params, reportPath, testTypes.waypoint)
  })

  process.exit(exitCode)
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
        `testSync`,
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
        `testCI`,
        `testDebug`
        `testCache`,
        `testReport`,
        `testColors`,
        'testTimeout',
        `testVerbose`,
        `testWorkers`,
        `testOpenHandles`,
      ]
    ),
  },
}
