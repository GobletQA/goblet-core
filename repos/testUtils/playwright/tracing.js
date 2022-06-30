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
  return await context.tracing.start(gobletOptions.tracing)
}

/**
 * Starts tracing on the browser context
 * @param {Object} context - Browser context to start a tracing chunk
 *
 * @returns {Void}
 */
const startTracingChunk = async (context) => {
  if(!context || tracingDisabled()) return

  return await context.tracing.startChunk()
}

/**
 * Starts tracing on the browser context
 * @param {Object} context - Browser context to stop a tracing chunk
 *
 * @returns {Void}
 */
const stopTracingChunk = async (context) => {
  if(!context || tracingDisabled()) return

  // const { gobletPaths=noOpObj } = global
  // const { tracesDir } = gobletBrowserOpts
  // TODO: get the name of the file being tested and set it here
  await context.tracing.stopChunk({ path: `trace-${new Date().getTime()}.zip` })
}


module.exports = {
  startTracing,
  stopTracingChunk,
  startTracingChunk,
}