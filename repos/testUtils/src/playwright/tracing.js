const path = require('path')
const { noOpObj, get } = require('@keg-hub/jsutils')
const { ARTIFACT_SAVE_OPTS } = require('@GTU/constants')
const { appendToLatest } = require('@GTU/testMeta/testMeta')
const { getTestResult } = require('@GTU/reports/jasmineReporter')
const {
  getGeneratedName,
  copyArtifactToRepo,
  ensureRepoArtifactDir,
} = require('@GTU/Playwright/generatedArtifacts')

/**
 * Helper to check is tracing is disabled
 *
 * @returns boolean
 */
const tracingDisabled = () => {
  const tracing = get(global, `__goblet.options.tracing`)
  return Boolean(!tracing || (!tracing.screenshots && !tracing.snapshots))
}

/**
 * Starts tracing on the browser context
 * @param {Object} context - Browser context to start tracing on
 *
 * @returns {Void}
 */
const startTracing = async (context) => {
  if(!context || tracingDisabled()) return

  await context.tracing.start(get(global, `__goblet.options.tracing`, noOpObj))

  return true
}

/**
 * Starts tracing on the browser context
 * @param {Object} context - Browser context to start a tracing chunk
 *
 * @returns {Void}
 */
const startTracingChunk = async (context) => {
  if(!context || context.__goblet.tracing || tracingDisabled()) return

  await context.tracing.startChunk()

  context.__goblet.tracing = true
  return true
}

/**
 * Checks if the context was recording a video
 * Then updates the testMeta with the path to the video
 * @param {string} testStatus - passed || failed
 * @param {string|boolean} saveVideo - one of `never` | `always` | `on-fail` | true | false
 *
 * @returns {boolean} - True if the trace should be saved
 */
const shouldSaveTrace = (testStatus, saveTrace) => {
  if(!saveTrace || saveTrace === ARTIFACT_SAVE_OPTS.never) return false

  return (saveTrace === ARTIFACT_SAVE_OPTS.always) ||
      (testStatus === ARTIFACT_SAVE_OPTS.failed && saveTrace === ARTIFACT_SAVE_OPTS.failed)
}

/**
 * Starts tracing on the browser context
 * @param {Object} context - Browser context to stop a tracing chunk
 *
 * @returns {Void}
 */
const stopTracingChunk = async (context) => {
  if(!context || !context.__goblet.tracing || tracingDisabled()) return

  const { saveTrace, tracesDir:repoTracesDir, testType } = get(global, `__goblet.options`, noOpObj)
  const { name, full, dir, nameTimestamp, testPath } = getGeneratedName()

  // Get the test result, which contains the passed/failed status of the test
  // If failed, then copy over trace from temp traces dir, to repoTracesDir
  // By default traces will not be saved
  const testResult = getTestResult(testPath)
  if(!shouldSaveTrace(testResult?.status, saveTrace)) return

  const { tracesDir, type:browser=`browser` } = get(global, `__goblet.browser.options`, noOpObj)
  
  const traceLoc = path.join(tracesDir, `${full}.zip`)
  await context.tracing.stopChunk({ path: traceLoc })

  const saveDir = await ensureRepoArtifactDir(repoTracesDir, dir)
  const savePath = await copyArtifactToRepo(saveDir, nameTimestamp, traceLoc)

  testType &&
    await appendToLatest(`${testType}.traces.${browser}.${name}`, {path: savePath}, true)
  
  context.__goblet.tracing = false
  return true
}


module.exports = {
  startTracing,
  stopTracingChunk,
  startTracingChunk,
}