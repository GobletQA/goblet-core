const { testTypes } = require('../../constants')
const { sharedOptions } = require('@keg-hub/cli-utils')
const { runTestCmd } = require('@GTasks/utils/helpers/runTestCmd')
const { buildJestArgs } = require('@GTasks/utils/jest/buildJestArgs')
const { getJestConfig } = require('@GTasks/utils/jest/getJestConfig')
const { filterTaskEnvs } = require('@GTasks/utils/envs/filterTaskEnvs')
const { buildUnitEnvs } = require('@GTasks/utils/envs/buildUnitEnvs')

/**
 * Run unit tests in container
 * @param {Object} args
 */
const runUnit = async args => {
  const { params, goblet, task } = args

  filterTaskEnvs(params, task)
  const jestConfig = await getJestConfig(params, testTypes.unit)

  // Run the test command for defined browsers
  const exitCode = await runTestCmd({
    params,
    goblet,
    type: testTypes.unit,
    cmdArgs: buildJestArgs(params, jestConfig),
    envsHelper: (browser, reportPath) => buildUnitEnvs(
      browser,
      goblet,
      params,
      reportPath,
      testTypes.unit
    )
  })

  process.exit(exitCode)

}

module.exports = {
  run: {
    name: 'run',
    alias: ['test'],
    action: runUnit,
    example: 'keg goblet unit run',
    description: 'Runs unit feature tests',
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
