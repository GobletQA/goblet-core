const { noOpObj, get } = require('@keg-hub/jsutils')
const { getTestResult } = require('GobletTest/reports/jasmineReporter')
const {
  getGeneratedName,
  copyArtifactToRepo,
  ensureRepoArtifactDir,
} = require('GobletPlaywright/generatedArtifacts')

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

  const { saveReport } = get(global, `__goblet.options`, noOpObj)
  const { testPath } = getGeneratedName()
  const testResult = getTestResult(testPath)
  
  if(!shouldSaveReport(testResult?.status, saveReport)) return

  const reportSplit = GOBLET_HTML_REPORTER_OUTPUT_PATH.split(`/`)
  const reportName = reportSplit.pop()
  const reportLoc = reportSplit.join(`/`)
  const reportTempPath = get(global, `__goblet.paths.reportTempPath`)

  // IF the temp report path is the same as the ENV output path, then just return
  if(reportTempPath === GOBLET_HTML_REPORTER_OUTPUT_PATH) return

  await ensureRepoArtifactDir(reportLoc)
  await copyArtifactToRepo(reportLoc, reportName, reportTempPath)

}

module.exports = {
  copyTestReports
}