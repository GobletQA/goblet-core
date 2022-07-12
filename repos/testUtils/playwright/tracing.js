const path = require('path')
const { noOpObj, get } = require('@keg-hub/jsutils')
const { getGeneratedName } = require('./getGeneratedName')
const { appendToLatest } = require('GobletTest/testMeta/testMeta')

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

  const { tracing } = get(global, `__goblet.options`, noOpObj)
  await context.tracing.start(tracing)

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
  // TODO: use global.jasmine to check if the test passed of failed
  // Then passed, just delete the trace so we only keep failed traces
  const { testType } = get(global, `__goblet.options`, noOpObj)
  const { tracesDir, type:browser=`browser` } = get(global, `__goblet.browser.options`, noOpObj)
  const { name, full } = getGeneratedName()
  
  const traceLoc = path.join(tracesDir, `${full}.zip`)
  await context.tracing.stopChunk({ path: traceLoc })

  testType &&
    await appendToLatest(`${testType}.traces.${browser}.${name}`, {path: traceLoc}, true)
  
  context.__goblet.tracing = false
  return true
}


module.exports = {
  startTracing,
  stopTracingChunk,
  startTracingChunk,
}