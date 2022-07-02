const os = require('os')
const path = require('path')
const { promises } = require('fs')

const defaultStateFile = 'browser-context-state'
const defaultCookieFile = 'browser-cookie-state'

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
const saveBrowserCookie = async (context, location) => {
  const cookies = await context.cookies()
  const cookieJson = JSON.stringify(cookies)
  await promises.writeFile(browserCookieLoc(location), cookieJson)

  return true
}

const addBrowserCookie = async () => {
  const cookies = fs.readFileSync('cookies.json', 'utf8')

  const deserializedCookies = JSON.parse(cookies)
  await context.addCookies(deserializedCookies)
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
  if(!global.browser) throw new Error('Browser type not initialized')
  if(!global.context){
    // TODO: figure out how to pull the saved context state 
    global.context = await browser.newContext({
      ...contextOpts,
      // TODO: figure out if this fails when the path does not exist
      storageState: contextStateLoc(location)
    })
    // global.context = await global.browser.newContext(contextOpts)
  }

  return global.context
}


module.exports = {
  getContext,
  contextStateLoc,
  saveContextState,
  defaultStateFile,
  browserCookieLoc,
  saveBrowserCookie,
  defaultCookieFile,
}