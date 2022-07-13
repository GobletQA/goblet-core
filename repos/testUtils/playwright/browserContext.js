const os = require('os')
const path = require('path')
const { promises } = require('fs')
const { startTracing } = require('./tracing')
const { get, noOpObj } = require('@keg-hub/jsutils')
const { getMetadata } = require('GobletSCPlaywright/server/server')
const { newBrowser } = require('GobletSCPlaywright/browser/newBrowser')

const defaultStateFile = 'browser-context-state'
const defaultCookieFile = 'browser-cookie-state'

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
const browserCookieLoc = (saveLocation) => {
  const tempDir = os.tmpdir()
  const location = `${(saveLocation || defaultCookieFile).split(`.json`).shift()}.json`

  return path.join(tempDir, location)
}

/**
 * Save storage state into the file.
 */
const saveContextCookie = async (context, location) => {
  const cookies = await context.cookies()
  const saveLoc = browserCookieLoc(location)
  await promises.writeFile(saveLoc, JSON.stringify(cookies))

  return true
}

const setContextCookie = async (context, location) => {
  const loadLoc = browserCookieLoc(location)
  // TODO: Investigate if this should throw or not
  // If instead we want to return false because the cookie could not be set
  // Then uncomment this code
  // const [err] = await limbo(promises.access(loadLoc, constants.F_OK))
  // if(err) return false

  const cookie = await promises.readFile(loadLoc, 'utf8')
  await context.addCookies(JSON.parse(cookie))
  context.__goblet.cookie = loadLoc

  return true
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


module.exports = {
  getContext,
  setupBrowser,
  setupContext,
  setContextCookie,
  contextStateLoc,
  saveContextState,
  defaultStateFile,
  browserCookieLoc,
  saveContextCookie,
  defaultCookieFile,
}