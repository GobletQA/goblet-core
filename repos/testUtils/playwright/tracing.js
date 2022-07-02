const path = require('path')
const { noOpObj } = require('@keg-hub/jsutils')

/**
 * Helper to check is tracing is disabled
 *
 * @returns boolean
 */
const tracingDisabled = () => {
  const { gobletOptions=noOpObj } = global
  const { tracing } = gobletOptions

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

  const { gobletOptions=noOpObj } = global
  await context.tracing.start(gobletOptions.tracing)

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
 * Starts tracing on the browser context
 * @param {Object} context - Browser context to stop a tracing chunk
 *
 * @returns {Void}
 */
const stopTracingChunk = async (context) => {
  if(!context || !context.__goblet.tracing || tracingDisabled()) return

  const { gobletBrowserOpts=noOpObj } = global
  const { tracesDir } = gobletBrowserOpts
  
  const timestamp = new Date().getTime()
  // TODO: see if theres a better way to get the test name from the jasmine api
  // Get the name of the file being tested and set it here
  const name = global.jasmine.testPath.split(`/`).pop()
  const traceLoc = path.join(tracesDir, `${name}/${timestamp}/trace.zip`)

  await context.tracing.stopChunk({ path: traceLoc })
  context.__goblet.tracing = false
  
  return true
}


module.exports = {
  startTracing,
  stopTracingChunk,
  startTracingChunk,
}