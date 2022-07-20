const { testTypes } = require('../../constants')
const { sharedOptions } = require('@keg-hub/cli-utils')
const { runTestCmd } = require('@GTasks/utils/helpers/runTestCmd')
const { buildJestArgs } = require('@GTasks/utils/jest/buildJestArgs')
const { getJestConfig } = require('@GTasks/utils/jest/getJestConfig')
const { filterTaskEnvs } = require('@GTasks/utils/envs/filterTaskEnvs')
const { buildWaypointEnvs } = require('@GTasks/utils/envs/buildWaypointEnvs')

/**
 * Run task for waypoint scripts
 * node ./tasks/runTask.js waypoint run context=/keg/repos/lancetipton/current/goblet/waypoint/first.waypoint.js
 */
const runWp = async args => {
  const { params, goblet, task } = args

  filterTaskEnvs(params, task)
  const jestConfig = await getJestConfig(params, testTypes.waypoint)

  // Run the test command for defined browsers
  const exitCode = await runTestCmd({
    params,
    goblet,
    type: testTypes.waypoint,
    cmdArgs: buildJestArgs(params, jestConfig),
    envsHelper: (browser, reportPath) => buildWaypointEnvs(
      browser,
      goblet,
      params,
      reportPath,
      testTypes.waypoint
    )
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
        `testDebug`,
        `testCache`,
        `testReport`,
        `testReportName`,
        `testColors`,
        'testTimeout',
        `testVerbose`,
        `testWorkers`,
        `testOpenHandles`,
        `artifactsDebug`,
      ]
    ),
  },
}
