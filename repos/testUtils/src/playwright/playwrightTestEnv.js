const { Logger } = require('@keg-hub/cli-utils')
const { copyTestReports } = require('@GTU/Playwright/testReport')
const { saveRecordingPath } = require('@GTU/Playwright/videoRecording')
const { initTestMeta, commitTestMeta } = require('@GTU//testMeta/testMeta')
const { stopTracingChunk, startTracingChunk } = require('@GTU/Playwright/tracing')
const { setupBrowser, setupContext, getContext } = require('@GTU/Playwright/browserContext')

let LAST_ACTIVE_PAGE

/**
 * Helper to force exit the process after 1/2 second
 */
const forceExit = (err) => {
  Logger.stderr(`\n[Goblet] Playwright Initialize Error\n`)
  err && Logger.stderr(`\n${err.stack}\n`)
  setTimeout(() => process.exit(1), 500)
}

/**
 * Initializes tests by connecting to the browser loaded at the websocket
 * Then creates a new context from the connected browser
 * Adds both browser and context to the global scope
 * @param {Function} done - jest function called when all asynchronous ops are complete
 *
 * @return {boolean} - true if init was successful
 */
const initialize = async () => {

  let startError

  try {
    await initTestMeta()
    await setupBrowser()
    await setupContext()
  }
  catch (err) {
    startError = true
    await cleanup(true)
    forceExit(err)
  }
  finally {
    return !startError &&
      await startTracingChunk(global.context)
  }
}

/**
 * Cleans up for testing tear down by releasing all resources, including
 * the browser window and any globals set in `initialize`.
 * @param {Function} done - jest function called when all asynchronous ops are complete
 *
 * @return {boolean} - true if cleanup was successful
 */
const cleanup = async (fromError) => {
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

    await copyTestReports()
    await commitTestMeta()

    delete global.browser
    delete global.context
    delete global.page

    return true
  }
  catch(err){
    forceExit(err)
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
