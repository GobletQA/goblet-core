const os = require('os')
const path = require('path')
const { startTracing } = require('./tracing')
const { get, noOpObj } = require('@keg-hub/jsutils')
const { getMetadata } = require('@GSC/Playwright/server/server')
const { newBrowser } = require('@GSC/Playwright/browser/newBrowser')
const {
  browserCookieLoc,
  setContextCookie,
  defaultCookieFile,
  saveContextCookie
} = require('@GTU/Playwright/browserCookie')

let LAST_ACTIVE_PAGE
const defaultStateFile = 'browser-context-state'

/**
 * Sets up the global browser for the test environment
 *
 * @returns {Object} - Playwright Browser object
 */
const setupBrowser = async () => {
  /** GOBLET_BROWSER is set by the task `keg goblet bdd run` */
  const { GOBLET_BROWSER='chromium' } = process.env
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
  
  return global.browser
}

/**
 * Sets up the global context for the test environment
 *
 * @returns {Object} - Playwright Context object
 */
const setupContext = async () => {
  global.context = await getContext(get(global, `__goblet.context.options`))
  await startTracing(global.context)

  return global.context
}

/**
 * Gets the storage location from the temp-directory
 */
const contextStateLoc = (saveLocation) => {
  const tempDir = os.tmpdir()
  const location = `${(saveLocation || defaultStateFile).split(`.json`).shift()}.json`

  return path.join(tempDir, location)
}

/**
 * Save storage state into the file.
 */
const saveContextState = async (context, location) => {
  return await context.storageState({ path: contextStateLoc(location) })
}

/**
 * Gets the browser page instance, or else creates a new one
 * @param {number} num - The page number to get if multiple exist
 *
 * @return {Object} - Playwright browser page object
 */
const getContext = async (contextOpts, location) => {
  contextOpts = contextOpts || get(global, `__goblet.context.options`, noOpObj)

  if(!global.browser) throw new Error('Browser type not initialized')
  if(!global.context){
    try {
      // TODO: figure out how to pull the saved context state 
      global.context = await browser.newContext({
        ...contextOpts,
        // TODO: Need to add this dynamically based on some env or tag?
        // storageState: contextStateLoc(location)
      })
    }
    catch(err){
      if(err.code === `ENOENT` && err.message.includes(`Error reading storage state`))
        console.warn(`[Goblet] Saved Context State ${location} does not exist.`)
      else global.context = await global.browser.newContext(contextOpts)
    }
  }
  // Goblet options that are context specific
  // Not great, and there's better way to store this,
  // because we don't own the context object, but this works now
  global.context.__goblet = global.context.__goblet || {}
  return global.context
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

const getLastActivePage = () => LAST_ACTIVE_PAGE
const setLastActivePage = (page) => {
  LAST_ACTIVE_PAGE = page
}

module.exports = {
  getPage,
  getContext,
  setupBrowser,
  setupContext,
  contextStateLoc,
  saveContextState,
  defaultStateFile,
  browserCookieLoc,
  setContextCookie,
  getLastActivePage,
  setLastActivePage,
  saveContextCookie,
  defaultCookieFile,
}