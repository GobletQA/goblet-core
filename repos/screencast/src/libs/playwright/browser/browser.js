const { Logger } = require('@keg-hub/cli-utils')
const { defaultBrowser } = require('HerkinSCConstants')
const { isStr, get, set, isFunc } = require('@keg-hub/jsutils')

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
  try {
    const oldPage = !page && getPage(type)
    oldPage && oldPage.close()
  } catch (err) {
    Logger.warn(err.message)
  }

  set(PW_BROWSERS, [type, `page`], page)

  // Add listener to delete the context when closed
  page &&
    isFunc(page.on) &&
    page.on('close', () => {
      if(!type || !PW_BROWSERS[type] || !PW_BROWSERS[type].page) return

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
  // If no context, get the old content and close it if it exists
  try {
    const oldContext = !context && getContext(type)
    oldContext && oldContext.close()
  } catch (err) {
    Logger.warn(err.message)
  }

  set(PW_BROWSERS, [type, `context`], context)

  // Add listener to delete the context when closed
  context &&
    isFunc(context.on) &&
    context.on('close', () => {
      if(!type || !PW_BROWSERS[type]) return

      if(!PW_BROWSERS[type].context) return
      delete PW_BROWSERS[type].context

      // PW_BROWSERS[type].page &&
      //   isFunc(PW_BROWSERS[type].page.close) &&
      //   PW_BROWSERS[type].page.close()

      if(!PW_BROWSERS[type].page) return
      delete PW_BROWSERS[type].page
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
  setBrowsers(browser, type)
  // Add listener to delete the browser when closed
  browser &&
    isFunc(browser.on) &&
    browser.on('disconnected', () => {
      if (!type || !PW_BROWSERS[type] || !PW_BROWSERS[type].browser) return
      delete PW_BROWSERS[type].browser
    })
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
const closeBrowser = (browser, type) => {
  try {
    browser = browser || get(PW_BROWSERS, [type, `browser`])
    browser && browser.close()
  } catch (err) {
    Logger.warn(err.message)
  }

  if (type && PW_BROWSERS[type]) delete PW_BROWSERS[type]

  browser = undefined
  return PW_BROWSERS
}

/**
 * Adds a browser to the Browsers object by type
 * If no second argument, use the browser.name method to set the type
 * If first param is a string name of a browser
 * Or if no first param, and second param is a string name of a browser
 * Then delete the browser from the browser object by browser name || type
 * @example
 * setBrowsers(`chromium`) === setBrowsers(null, `chromium`) === (delete PW_BROWSERS.chromium)
 * @example
 * setBrowsers(chromeBrowserObj) === setBrowsers(browserObj, `chromium`)
 * @function
 * @private
 *
 * @param {Object|string} browser - Playwright browser object || Browser type
 * @param {string} type - Playwright browser type ( chromium | firefox | webkit )
 *
 * @return {Object} - The PW_BROWSERS cache, with the browser removed
 */
const setBrowsers = (browser, type) => {
  // If browser type is passed as the first param
  // Then Remove the browser
  if (isStr(browser) && !type)
    return closeBrowser(get(PW_BROWSERS, [browser, `browser`]), browser)

  // Or if no browser is passed, and a type is passed
  // Then Remove the browser
  if (!browser) return closeBrowser(get(PW_BROWSERS, [type, `browser`]), type)

  const bType = type || browser.name() || defaultBrowser

  // Close the old browser if it exists
  closeBrowser(get(PW_BROWSERS, [bType, `browser`]), bType)

  // Set the new browser
  PW_BROWSERS[bType] = { browser }

  return PW_BROWSERS
}

module.exports = {
  getPage,
  setPage,
  getContext,
  setContext,
  getBrowser,
  setBrowser,
}
