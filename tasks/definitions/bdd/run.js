const { testTypes } = require('../../constants')
const { sharedOptions, Logger } = require('@keg-hub/cli-utils')
const { runTestCmd } = require('@GTasks/utils/helpers/runTestCmd')
const { buildBddEnvs } = require('@GTasks/utils/envs/buildBddEnvs')
const { buildJestArgs } = require('@GTasks/utils/jest/buildJestArgs')
const { getJestConfig } = require('@GTasks/utils/jest/getJestConfig')
const { filterTaskEnvs } = require('@GTasks/utils/envs/filterTaskEnvs')

/**
 * Run parkin tests in container
 * @param {Object} args
 * @param {Object} args.task - Test definition object
 * @param {Object} args.goblet - Goblet global config
 * @param {Object} args.params - Options arguments parsed into an object
 * @param {Array} args.options - Options passed to the task from the command line
 */
const runBdd = async args => {
  const { params, goblet, task } = args

  process.env.GOBLET_TEST_DEBUG &&
    Logger.stdout(`runBdd Task Params:\n${JSON.stringify(params, null, 2)}\n`)

  filterTaskEnvs(params, task)
  const jestConfig = await getJestConfig(params, testTypes.feature)

  // Run the test command for defined browsers
  const exitCode = await runTestCmd({
    params,
    goblet,
    type: testTypes.bdd,
    cmdArgs: buildJestArgs(params, jestConfig),
    envsHelper: (browser, reportPath) => buildBddEnvs(browser, params, reportPath, testTypes.feature)
  })

  process.exit(exitCode)
}

module.exports = {
  run: {
    name: 'run',
    action: runBdd,
    example: 'keg goblet bdd test',
    description: 'Runs bdd feature tests',
    alias: ['bdd', 'test'],
    options: sharedOptions(
      'test',
      {},
      [
        'context',
        'browsers',
        'allBrowsers',
        'chromium',
        'firefox',
        'webkit',
        'headless',
        'tags',
        'filter',
        'concurrent',
        'log',
        'noTests',
        'slowMo',
        'browserTimeout',
        'debug',
        `testCI`,
        'testBail',
        `testSync`,
        `testDebug`,
        'testRetry',
        `testCache`,
        `testReport`,
        `testReportName`,
        `testColors`,
        'testTimeout',
        `testVerbose`,
        `testWorkers`,
        `testOpenHandles`,
        `parkinDebug`,
        'devtools',
        'container',
        'mode',
        'repo',
        `tracing`,
        `screenshot`,
        'base',
        'device',
        'width',
        'height',
        'appUrl',
        'downloads',
        'geolocation',
        'hasTouch',
        'isMobile',
        'permissions',
        'record',
        'storageState',
        'timezone',
        `artifactsDebug`,
      ]
    ),
  },
}
