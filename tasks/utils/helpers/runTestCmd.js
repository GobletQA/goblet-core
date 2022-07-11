const { noOpObj } = require('@keg-hub/jsutils')
const { dockerCmd } = require('@keg-hub/cli-utils')
const { upsertTestMeta } = require('GobletTest/testMeta/testMeta')
const { runCommands } = require('GobletTasks/utils/helpers/runCommands')
const { getBrowsers } = require('GobletSCPlaywright/helpers/getBrowsers')
const { handleTestExit } = require('GobletTasks/utils/helpers/handleTestExit')

const filterLogs = (data, { silent }) => {
  if(silent) return

  return data
}

const cmdCallbacks = (res, opts=noOpObj) => {
  const output = { data: [], error: [] }

  return {
    onStdOut: data => {
      console.log(`------- on stdout -------`)
      const filtered = filterLogs(data, opts)
      filtered && Logger.stdout(filtered)
      output.data.push(data)
    },
    onStdErr: data => {
      console.log(`------- on stderr -------`)
      const filtered = filterLogs(data, opts)
      filtered && Logger.stderr(filtered)
      output.error.push(data)
    },
    onError: data => {
      const filtered = filterLogs(data, opts)
      filtered && Logger.stderr(filtered)
      output.error.push(data)
    },
    onExit: (exitCode) => (
      res({
        exitCode,
        data: output.data.join(''),
        error: output.error.join(''),
      })
    )
  }
}


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
    type,
    params,
    cmdArgs,
    reportPath,
    envsHelper,
  } = args

  const commands = getBrowsers(params).map(
    browser => {
      const cmdOpts = envsHelper(browser)
      const browserCmd = async () => {
        // TODO: get the event callbacks working properly
        // They don't seem to be doing anything
        const resp = await new Promise(async (res, rej) => {

          await dockerCmd(params.container, [...cmdArgs], {
            ...cmdOpts,
            ...cmdCallbacks(res, { ...params, silent: true }),
          })

          await upsertTestMeta(`${type}.browsers.${browser}`, {
            name: browser,
            status: exitCode ? `failed` : `passed`,
          })

          return res(exitCode)
        })

        resp.data && console.log(resp.data)
        resp.error && console.log(resp.error)

        return resp.exitCode
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