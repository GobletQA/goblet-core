const { getBrowsers } = require('HerkinSC')
const { dockerCmd } = require('@keg-hub/cli-utils')
const { runCommands } = require('HerkinTasks/utils/helpers/runCommands')
const { handleTestExit } = require('HerkinTasks/utils/helpers/handleTestExit')

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
    browser => () => {
      return dockerCmd(
        params.container,
        cmdArgs,
        envsHelper(browser)
      )
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