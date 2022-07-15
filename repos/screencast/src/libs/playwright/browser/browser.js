const { Logger } = require('@keg-hub/cli-utils')
const { isFunc, get, set } = require('@keg-hub/jsutils')
const { defaultBrowser } = require('@GSC/Constants')

/**
 * Cache holder for all launched playwright browsers by type
 * @type {Object|undefined}
 */
let PW_BROWSERS = {}

/**
 * Returns the cached playwrite page
 * @function
 * @param {string} type - Playwright browser type ( chromium | firefox | webkit )
 *
 * @returns {Object} - Playwright browser page || undefined
 */
const getPage = (type = defaultBrowser) => {
  return get(PW_BROWSERS, [type, `page`])
}

/**
 * Sets the cached Playwright page
 * @function
 * @param {Object|undefined} page - Playwright browser page
 * @param {string} type - Playwright browser type ( chromium | firefox | webkit )
 *
 * @returns {void}
 */
const setPage = (page, type = defaultBrowser) => {

  const oldPage = getPage(type)

  if(oldPage){
    if(oldPage && page){
      console.log(`oldPage already set`)
      console.log(`typeof oldPage`, typeof oldPage)
      console.log(`typeof page`, typeof page)
      console.log(`page are equal`, page === oldPage)
    }

    return oldPage
  }

  set(PW_BROWSERS, [type, `page`], page)
  
  // // Add listener to delete the context when closed
  page &&
    isFunc(page.on) &&
    page.on('close', () => {
      if(!PW_BROWSERS[type] || !PW_BROWSERS[type].page) return
      delete PW_BROWSERS[type].page
    })
  
}


/**
 * Returns the cached Playwright context
 * @function
 * @param {string} type - Playwright browser type ( chromium | firefox | webkit )
 *
 * @returns {Object} - Playwright browser context || undefined
 */
const getContext = (type = defaultBrowser) => {
  return get(PW_BROWSERS, [type, `context`])
}

/**
 * Sets the cached Playwright context
 * @function
 * @param {Object|undefined} context - Playwright browser context
 * @param {string} type - Playwright browser type ( chromium | firefox | webkit )
 *
 * @returns {void}
 */
const setContext = (context, type = defaultBrowser) => {
  
  const oldContext = getContext(type)
  
  if(oldContext){
    if(context && oldContext){
      console.log(`oldContext already set`)
      console.log(`typeof oldContext`, typeof oldContext)
      console.log(`typeof context`, typeof context)
      console.log(`Contexts are equal`, context === oldContext)
    }

    return oldContext
  }

  set(PW_BROWSERS, [type, `context`], context)

  // // Add listener to delete the context when closed
  context &&
    isFunc(context.on) &&
    context.on('close', async () => {
      if(!PW_BROWSERS[type] || !PW_BROWSERS[type].context) return
      delete PW_BROWSERS[type].context
    })
}

/**
 * Returns the cached playwrite browser
 * @function
 * @param {string} type - Playwright browser type ( chromium | firefox | webkit )
 *
 * @return {Object|undefined} - Playwright browser object or undefined
 */
const getBrowser = (type = defaultBrowser) => {
  return get(PW_BROWSERS, [type, `browser`])
}

/**
 * Sets the cached playwrite server
 * @function
 * @return {Object|undefined} - Playwright browser object or undefined
 */
const setBrowser = (browser, type = defaultBrowser) => {
  const oldBrowser = getBrowser(type)

  if(oldBrowser){
    if(browser && oldBrowser){
      console.log(`oldBrowser already set`)
      console.log(`typeof oldBrowser`, typeof oldBrowser)
      console.log(`typeof browser`, typeof browser)
      console.log(`browsers are equal`, browser === oldBrowser)
    }

    return PW_BROWSERS
  }

  const bType = type || browser.name() || defaultBrowser

  // Set the new browser
  PW_BROWSERS[bType] = { browser }

  // // Add listener to delete the browser when closed
  browser &&
    isFunc(browser.on) &&
    browser.on('disconnected', async () => {
      if (!PW_BROWSERS[type] || !PW_BROWSERS[type].browser) return

      delete PW_BROWSERS[type].browser
    })

  return PW_BROWSERS
}


/**
 * Closes a browser, and removes it from the PW_BROWSERS object
 * Is only removed if a type is passed
 * @function
 * @private
 *
 * @param {Object|string} browser - Playwright browser object || Browser type
 * @param {string} type - Playwright browser type ( chromium | firefox | webkit )
 *
 * @return {Object} - The PW_BROWSERS cache, with the browser removed
 */
const closeBrowser = async (browser) => {
  try {
    browser && await browser.close()
  }
  catch (err) {
    Logger.warn(err.message)
  }

  return PW_BROWSERS
}

module.exports = {
  getPage,
  setPage,
  getContext,
  setContext,
  getBrowser,
  setBrowser,
  closeBrowser,
}
