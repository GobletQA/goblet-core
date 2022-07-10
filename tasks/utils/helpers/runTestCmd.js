const { dockerCmd } = require('@keg-hub/cli-utils')
const { runCommands } = require('GobletTasks/utils/helpers/runCommands')
const { getBrowsers } = require('GobletSCPlaywright/helpers/getBrowsers')
const { handleTestExit } = require('GobletTasks/utils/helpers/handleTestExit')
const { upsertTestMeta } = require('GobletTest/testMeta/testMeta')

/**
 * Helper to run the command to execute tests
 * @param {Object} params - Options arguments parsed into an object
 * @param {Array|string} cmdArgs - Arguments to pass to the test runner
 * @param {string} reportPath - Path to where the test report should be saved
 * @param {function} envsHelper - Helper method to generate the correct envs for the test run
 *
 * @returns {Number} - Sum of all exit codes from the executed test commands
 */
const runTestCmd = async (args) => {
  const {
    params,
    cmdArgs,
    reportPath,
    envsHelper,
  } = args

  const commands = getBrowsers(params).map(
    browser => {
      const cmdOpts = envsHelper(browser)
      const browserCmd = async () => {
        // TODO: add callbacks to get access to the dockerCmd output
        // This way we can extract out logged day same as the frontend
        const exitCode = await dockerCmd(params.container, [...cmdArgs], cmdOpts)
        await upsertTestMeta(`bdd.browsers.${browser}`, {
          name: browser,
          status: exitCode ? `failed` : `passed`,
        })

        return exitCode
      }

      browserCmd.browser = browser
      browserCmd.cmdArgs = cmdArgs
      browserCmd.cmdOpts = cmdOpts

      return browserCmd
    }
  )

  // Run each of the test command in sequence
  const codes = await runCommands(commands, params)

  // Calculate the exit codes so we know if all runs were successful
  return handleTestExit(codes, reportPath)
}


module.exports = {
  runTestCmd
}