const { getBrowsers } = require('HerkinSC')
const { testTypes } = require('../../constants')
const { sharedOptions, dockerCmd } = require('@keg-hub/cli-utils')
const { buildBddEnvs } = require('HerkinTasks/utils/envs/buildBddEnvs')
const { runCommands } = require('HerkinTasks/utils/helpers/runCommands')
const { buildReportPath } = require('HerkinTest/reports/buildReportPath')
const { buildJestArgs } = require('HerkinTasks/utils/jest/buildJestArgs')
const { getJestConfig } = require('HerkinTasks/utils/jest/getJestConfig')
const { filterTaskEnvs } = require('HerkinTasks/utils/envs/filterTaskEnvs')
const { handleTestExit } = require('HerkinTasks/utils/helpers/handleTestExit')

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

  const browsers = getBrowsers(params)
  const jestConfig = await getJestConfig(params, testTypes.feature)
  const reportPath = buildReportPath(testTypes.feature, params.context, herkin)
  const cmdArgs = buildJestArgs(
    params,
    jestConfig,
    // Force run the tests in sequence
    ['--runInBand']
  )

  const commands = browsers.map(
    browser => () => {
      return dockerCmd(
        params.container,
        cmdArgs,
        buildBddEnvs(browser, params, reportPath, testTypes.feature),
      )
    }
  )

  // Run each of the test command in sequence
  const codes = await runCommands(commands, params)

  // Calculate the exit codes so we know if all runs were successful
  return handleTestExit(codes, reportPath)
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
        'bail',
        'noTests',
        'slowMo',
        'timeout',
        'browserTimeout',
        'debug',
        `jestDebug`,
        'devtools',
        'container',
        'mode',
        'sync',
        'repo',
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
