const { Logger } = require('@keg-hub/cli-utils')
const { noOpObj, get } = require('@keg-hub/jsutils')
const { saveRecordingPath } = require('./videoRecording')
const { getContext } = require('GobletPlaywright/browserContext')
const { commitTestMeta } = require('GobletTest/testMeta/testMeta')
const { initTestMeta } = require('GobletTest/testMeta/testMeta')
const { getMetadata } = require('GobletSCPlaywright/server/server')
const { newBrowser } = require('GobletSCPlaywright/browser/newBrowser')
const { startTracing, stopTracingChunk, startTracingChunk } = require('./tracing')

let LAST_ACTIVE_PAGE

/**
 * Initializes tests by connecting to the browser loaded at the websocket
 * Then creates a new context from the connected browser
 * Adds both browser and context to the global scope
 * @param {Function} done - jest function called when all asynchronous ops are complete
 *
 * @return {boolean} - true if init was successful
 */
const initialize = async () => {
  /** GOBLET_BROWSER is set by the task `keg goblet bdd run` */
  const { GOBLET_BROWSER='chromium' } = process.env
  let startError

  try {

    await initTestMeta()
    const { type, launchOptions } = await getMetadata(GOBLET_BROWSER)

    // TODO: Should update to check if in docker container
    // Then pass false based on that
    // Pass false to bypass checking the browser status
    const { browser } = await newBrowser({
      ...launchOptions,
      type,
      ...get(global, `__goblet.browser.options`, noOpObj),
    }, false)

    if (!browser)
      throw new Error(`Could not create browser. Please ensure the browser server is running.`)

    global.browser = browser
    global.context = await getContext(get(global, `__goblet.context.options`))
    await startTracing(global.context)

  }
  catch (err) {
    startError = true
    Logger.stderr(err.stack)
    await cleanup()
    process.exit(1)
  }
  finally {
    if(startError) return

    await startTracingChunk(global.context)
    return global.context && global.browser
  }
}

/**
 * Cleans up for testing tear down by releasing all resources, including
 * the browser window and any globals set in `initialize`.
 * @param {Function} done - jest function called when all asynchronous ops are complete
 *
 * @return {boolean} - true if cleanup was successful
 */
const cleanup = async () => {
  if (!global.browser){
    await commitTestMeta()
    return false
  }

  // Wrap in try catch and properly exit if there's an error
  // TODO: need to figure out the proper exit code for non-test errors
  // This way we can know it not a test that failed
  try {
    await stopTracingChunk(global.context)

    // Await the close of the context due to video recording
    await global.context.close()
    await saveRecordingPath(LAST_ACTIVE_PAGE)

    LAST_ACTIVE_PAGE = undefined
    global.browser && await global.browser.close()

    await commitTestMeta()

    delete global.browser
    delete global.context
    delete global.page

    return true
  }
  catch(err){
    Logger.stderr(err.stack)
    setTimeout(() => process.exit(1), 500)
  }
}

/**
 * Gets the browser page instance, or else creates a new one
 * @param {number} num - The page number to get if multiple exist
 *
 * @return {Object} - Playwright browser page object
 */
const getPage = async (num = 0) => {
  if (!global.context) throw new Error('No browser context initialized')

  const pages = global.context.pages() || []
  LAST_ACTIVE_PAGE = pages.length ? pages[num] : await global.context.newPage()

  return LAST_ACTIVE_PAGE
}

/**
 * Helper method to return the getPage method
 *
 * @return {Object} - Contains the getPage method
 */
const getBrowserContext = () => ({ getPage, getContext })


module.exports = {
  getBrowserContext,
  initialize,
  cleanup,
}
