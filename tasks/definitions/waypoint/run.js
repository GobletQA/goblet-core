const { testTypes } = require('../../constants')
const { sharedOptions } = require('@keg-hub/cli-utils')
const { runTestCmd } = require('GobletTasks/utils/helpers/runTestCmd')
const { buildJestArgs } = require('GobletTasks/utils/jest/buildJestArgs')
const { getJestConfig } = require('GobletTasks/utils/jest/getJestConfig')
const { filterTaskEnvs } = require('GobletTasks/utils/envs/filterTaskEnvs')
const { buildWaypointEnvs } = require('GobletTasks/utils/envs/buildWaypointEnvs')
const { appendToLatest, commitTestMeta } = require('GobletTest/testMeta/testMeta')

/**
 * Run task for waypoint scripts
 * node ./tasks/runTask.js waypoint run context=/keg/repos/lancetipton/current/goblet/waypoint/first.waypoint.js
 */
const runWp = async args => {
  filterTaskEnvs()
  const { params, goblet } = args
  const jestConfig = await getJestConfig(params, testTypes.waypoint)

  // Run the test command for defined browsers
  const exitCode = await runTestCmd({
    params,
    goblet,
    type: testTypes.waypoint,
    cmdArgs: buildJestArgs(params, jestConfig),
    envsHelper: (browser, reportPath) => buildWaypointEnvs(browser, params, reportPath, testTypes.waypoint)
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
        `testColors`,
        'testTimeout',
        `testVerbose`,
        `testWorkers`,
        `testOpenHandles`,
      ]
    ),
  },
}
