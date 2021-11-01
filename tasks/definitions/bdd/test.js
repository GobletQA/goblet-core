const path = require('path')
const { sharedOptions } = require('@keg-hub/cli-utils')
const { runSeq, isNum, get } = require('@keg-hub/jsutils')
const { getBrowserOpts, getBrowsers } = require('HerkinSC')
const { buildJestArgs } = require('HerkinTasks/utils/jest/buildJestArgs') 
const { startServers } = require('HerkinTasks/utils/playwright/startServers')
const { buildReportPath } = require('HerkinTasks/utils/reporter/buildReportPath')
const {
  dockerCmd,
  buildCmdOpts,
  handleTestExit,
} = require('HerkinTasks/utils/helpers')

/**
 * Run parkin tests in container
 * @param {Object} args
 * @param {Object} args.task - Test definition object
 * @param {Object} args.herkin - Keg-Herkin global config
 * @param {Object} args.params - Options arguments parsed into an object
 * @param {Array} args.options - Options passed to the task from the command line
 */
const doTests = async args => {
  const { params, herkin } = args
  const reportsDir = get(herkin, 'paths.reportsDir')
  
  const {
    slowMo,
    webkit,
    timeout,
    channel,
    headless,
  } = params

  const browsers = getBrowsers(params)

  const browserOpts = getBrowserOpts({
    channel,
    timeout,
    headless,
    timeout: isNum(timeout) ? timeout * 1000 : 0,
    slowMo: isNum(slowMo) ? slowMo * 1000 : undefined,
  })

  // Commenting out for now as it should not be needed
  // If running on host, server should already be running
  // If running on screencast, websocket server not used
  // await startServers(browsers, browserOpts)

  const cmdArgs = buildJestArgs(params, herkin)
  const reportPath = buildReportPath('feature', params.context, herkin)

  const commands = browsers.map(browser => () => dockerCmd(
    params.container,
    cmdArgs,
    buildCmdOpts(
      browser,
      params,
      reportPath,
    )
  ))

  // Run each of the test command in sequence
  const codes = await runSeq(commands)

  handleTestExit(codes, reportPath)
}

module.exports = {
  test: {
    name: 'test',
    action: doTests,
    example: 'keg herkin bdd test',
    description : 'Runs bdd feature tests',
    alias: ['bdd'],
    options: sharedOptions('test', {
      jestConfig: {
        description: 'Path to jest config relative to the root directory',
        default: 'configs/jest.parkin.config.js'
      },
      debug: {
        description: 'Runs with playwright debug mode activated',
        example: 'keg herkin cr test --debug',
        default: false
      },
    }, [
      'context',
      'allBrowsers',
      'chromium',
      'firefox',
      'webkit',
      'headless',
      'tags',
      'filter',
      'log',
      'bail',
      'noTests',
      'slowMo',
      'timeout',
      'container',
      'sync',
    ])
  }
}
