const { noOpObj, get } = require('@keg-hub/jsutils')
const { ARTIFACT_SAVE_OPTS } = require('@GTU/constants')
const { getTestResult } = require('@GTU/reports/jasmineReporter')
const { getGeneratedName, ensureRepoArtifactDir } = require('@GTU/Playwright/generatedArtifacts')

/**
 * Checks if the context was recording a test report
 * @param {string} testStatus - passed || failed
 * @param {string|boolean} saveVideo - one of `never` | `always` | `on-fail` | true | false
 *
 * @returns {boolean} - True if the report should be saved
 */
const shouldSaveReport = (testStatus, saveReport) => {
  if(!saveReport || saveReport === ARTIFACT_SAVE_OPTS.never) return false

  return (saveReport === ARTIFACT_SAVE_OPTS.always) ||
      (testStatus === ARTIFACT_SAVE_OPTS.failed && saveReport === ARTIFACT_SAVE_OPTS.failed)
}


/**
 * Checks if a test report should be saved
 * If so copies it from the temp dir to the configured reports path
 *
 * @returns {boolean} - True if the report should be saved
 */
const copyTestReports = async () => {
  const { GOBLET_HTML_REPORTER_OUTPUT_PATH } = process.env
  if(!GOBLET_HTML_REPORTER_OUTPUT_PATH) return

  const { saveReport, testType } = get(global, `__goblet.options`, noOpObj)
  const { type:browser=`browser` } = get(global, `__goblet.browser.options`, noOpObj)

  const { testPath } = getGeneratedName()
  const testResult = getTestResult(testPath)
  if(!shouldSaveReport(testResult?.status, saveReport)) return

  const reportSplit = GOBLET_HTML_REPORTER_OUTPUT_PATH.split(`/`)
  reportSplit.pop()
  const reportLoc = reportSplit.join(`/`)
  const reportTempPath = get(global, `__goblet.paths.reportTempPath`)

  // IF the temp report path is the same as the ENV output path, then just return
  if(reportTempPath === GOBLET_HTML_REPORTER_OUTPUT_PATH) return

  await ensureRepoArtifactDir(reportLoc)

  // Can't copy the html report here because it hasn't been created yet
  // So we do it after the command has run
  // Not sure this is the best solution, but seems to be the only one that works right now

  // await copyArtifactToRepo(GOBLET_HTML_REPORTER_OUTPUT_PATH, undefined, reportTempPath)

  // // Update the testMeta with the path to the report file for the specific browser
  // testType &&
  //   await appendToLatest(`${testType}.reports.${browser}`, {
  //     browser,
  //     path: GOBLET_HTML_REPORTER_OUTPUT_PATH,
  //     name: GOBLET_HTML_REPORTER_OUTPUT_PATH.split(`/`).pop(),
  //   })
}

module.exports = {
  copyTestReports
}