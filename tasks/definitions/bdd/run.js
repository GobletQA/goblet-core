const { getBrowsers } = require('HerkinSC')
const { testTypes } = require('../../constants')
const { sharedOptions } = require('@keg-hub/cli-utils')
const { runTestCmd } = require('HerkinTasks/utils/helpers/runTestCmd')
const { buildBddEnvs } = require('HerkinTasks/utils/envs/buildBddEnvs')
const { buildReportPath } = require('HerkinTest/reports/buildReportPath')
const { buildJestArgs } = require('HerkinTasks/utils/jest/buildJestArgs')
const { getJestConfig } = require('HerkinTasks/utils/jest/getJestConfig')
const { filterTaskEnvs } = require('HerkinTasks/utils/envs/filterTaskEnvs')

/**
 * Run parkin tests in container
 * @param {Object} args
 * @param {Object} args.task - Test definition object
 * @param {Object} args.herkin - Keg-Herkin global config
 * @param {Object} args.params - Options arguments parsed into an object
 * @param {Array} args.options - Options passed to the task from the command line
 */
const runBdd = async args => {
  filterTaskEnvs()
  const { params, herkin } = args
  const jestConfig = await getJestConfig(params, testTypes.feature)
  const reportPath = buildReportPath(testTypes.feature, params, herkin)
  // Run the test command for defined browsers
  const exitCode = await runTestCmd({
    params,
    reportPath,
    cmdArgs: buildJestArgs(params, jestConfig),
    envsHelper: browser => buildBddEnvs(browser, params, reportPath, testTypes.feature)
  })
  
  process.exit(exitCode)

}

module.exports = {
  run: {
    name: 'run',
    action: runBdd,
    example: 'keg herkin bdd test',
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
        'bddConfig',
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
      ]
    ),
  },
}
