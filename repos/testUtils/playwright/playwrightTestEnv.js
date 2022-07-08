const { noOpObj } = require('@keg-hub/jsutils')
const { getContext } = require('GobletPlaywright/browserContext')
const { getMetadata } = require('GobletSCPlaywright/server/server')
const { newBrowser } = require('GobletSCPlaywright/browser/newBrowser')
const { startTracing, stopTracingChunk, startTracingChunk } = require('./tracing')

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
  const { gobletBrowserOpts=noOpObj, gobletContextOpts=noOpObj } = global
  
  try {
    const { type, launchOptions } = await getMetadata(GOBLET_BROWSER)

    // TODO: Should update to check if in docker container
    // Then pass false based on that
    // Pass false to bypass checking the browser status
    const { browser } = await newBrowser({
      ...launchOptions,
      type,
      ...gobletBrowserOpts,
    }, false)

    if (!browser)
      throw new Error(`Could not create browser. Please ensure the browser server is running.`)

    global.browser = browser
    global.context = await getContext(gobletContextOpts)
    await startTracing(global.context)
  }
  catch (err) {
    console.error(err.message)
    // exit 2 seconds later to ensure error
    // has time to be written to stdout
    setTimeout(() => process.exit(1), 2000)
  }
  finally {
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
  if (!global.browser) return false
  
  // TODO: Update to use playwright video record end
  await stopTracingChunk(global.context)
  // await global.context.close()
  await global.browser.close()

  return new Promise((res) => {
    setTimeout(() => {
      delete global.browser
      delete global.context
      delete global.page
      res(true)
    }, 500)
  })
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
   return pages.length ? pages[num] : await global.context.newPage()
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
