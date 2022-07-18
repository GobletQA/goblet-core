const path = require('path')
const { noOpObj, noPropArr } = require('@keg-hub/jsutils')
const { dockerCmd, Logger } = require('@keg-hub/cli-utils')
const { parseParkinLogs } = require('@GTU/parkin/parseParkinLogs')
const { runCommands } = require('@GTasks/utils/helpers/runCommands')
const { buildReportPath } = require('@GTU/reports/buildReportPath')
const { getBrowsers } = require('@GSC/Playwright/helpers/getBrowsers')
const { PARKIN_SPEC_RESULT_LOG } = require('@GTU/constants/constants')
const { copyArtifactToRepo } = require('@GTU/Playwright/generatedArtifacts')
const { handleTestExit } = require('@GTasks/utils/helpers/handleTestExit')
const { appendToLatest, commitTestMeta } = require('@GTU/testMeta/testMeta')

const filterLogs = (data, params, parkinLogs) => {
  let filtered = data

  if(data.includes(PARKIN_SPEC_RESULT_LOG)){
    const { other, parkin } = parseParkinLogs(data, params)
    filtered = other
    parkinLogs.push(...parkin)
  }

  return filtered
}

const cmdCallbacks = (res, opts=noOpObj) => {
  const parkin = []
  const output = { data: [], error: [] }

  return {
    onStdOut: data => {
      const filtered = filterLogs(data, opts, parkin)
      if(!filtered) return

      Logger.stdout(filtered)
      output.data.push(filtered)
    },
    onStdErr: data => {
      const filtered = filterLogs(data, opts, parkin)
      if(!filtered) return

      Logger.stderr(filtered)
      output.error.push(filtered)
    },
    onError: data => {
      const filtered = filterLogs(data, opts, parkin)
      if(!filtered) return

      Logger.stderr(filtered)
      output.error.push(filtered)
    },
    onExit: (exitCode) => {
      return res({
        exitCode,
        data: output.data.join(''),
        error: output.error.join(''),
      })
    }
  }
}

/**
 * Builds a browser exec method inside docker via Jest
 * Runs in a child process and adds listeners for it's output
 * Allows capturing the output and formatting it as needed
 * @param {Array|string} cmdArgs - Arguments to pass to the test runner
 * @param {Object} cmdOpts - Extra Options for the child_process
 * @param {Object} params - Options arguments parsed into an object
 * @param {string} type - Type of tests being run
 * @param {string} browser - Name of the browser to run the tests for
 *
 * @returns {Number} - Sum of all exit codes from the executed test commands
 */
const buildBrowserCmd = (args) => {
  const {
    type,
    params,
    goblet,
    cmdOpts,
    cmdArgs,
    browser,
    reportPath
  } = args
  
  return async () => {
    const resp = await new Promise(async (res, rej) => {
      // TODO: Disabled until parkin log parsing is properly configured
      // await dockerCmd(params.container, [...cmdArgs], {
      //   ...cmdOpts,
      //   stdio: 'pipe',
      //   ...cmdCallbacks(res, params),
      // })

      // TODO: remove this once parkin log parsing is setup
      const exitCode = await dockerCmd(params.container, [...cmdArgs], cmdOpts)
      res({ exitCode })
    })

    await appendToLatest(`${type}.browsers.${browser}`, {
      name: browser,
      exitCode: resp.exitCode,
      status: resp.exitCode ? `failed` : `passed`,
    })

    // Only copy the reports if testReport option is set, otherwise just return
    if(!params.testReport) return

    // Copy the report after the tests have run, because it doesn't get created until the very end
    await copyArtifactToRepo(
      reportPath,
      undefined,
      path.join(goblet.internalPaths.reportsTempDir, `${browser}-html-report.html`)
    )

    // Update the testMeta with the path to the report file for the specific browser
    await appendToLatest(`${type}.reports.${browser}`, {
      browser: browser,
      path: reportPath,
      name: reportPath.split(`/`).pop(),
    })

    return resp.exitCode
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
    goblet,
    params,
    cmdArgs,
    envsHelper,
  } = args

  let reportPaths = [] 
  const commands = getBrowsers(params).map(
    browser => {
      const reportPath = buildReportPath(type, params, goblet, browser)
      reportPaths.push(reportPath)

      return buildBrowserCmd({
        type,
        goblet,
        params,
        cmdArgs,
        browser,
        reportPath,
        cmdOpts: envsHelper(browser, reportPath),
      })
    }
  )

  // Run each of the test command and capture the exit-codes
  const codes = await runCommands(commands, params)

  await commitTestMeta()

  // Calculate the exit codes so we know if all runs were successful
  return handleTestExit(codes, params.testReport ? reportPaths : noPropArr)
}


module.exports = {
  runTestCmd
}