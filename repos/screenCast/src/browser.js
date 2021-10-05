const playwright = require('playwright')
const { Logger } = require('@keg-hub/cli-utils')
const { noOpObj, noPropArr, deepMerge } = require('@keg-hub/jsutils')
const { flatUnion } = require('./utils/flatUnion')

/**
 * Cache holder for the launched playwright browser
 * @type {Object|undefined}
 */
let PW_BROWSER

/**
 * Cache holder for the launched playwright browser context
 * @type {Object|undefined}
 */
let PW_CONTEXT

/**
 * Cache holder for the opened playwright browser page
 * @type {Object|undefined}
 */
let PW_PAGE

/**
 * Starts browser using playwright
 * @function
 * @public
 * @param {Object} browserConf
 * @param {Array} browserConf.args - Arguments to pass to the browser on launch
 * @param {string} browserConf.type - Name of the browser to launch
 * @param {boolean} browserConf.active - Should the browser be started, must explicitly be set to false
 * @param {string} [browserConf.url=https://google.com] - Initial url the browser should navigate to
 * @param {Object} browserConf.config - Options to pass to the browser on launch
 *
 * @returns {Object} - Contains the page, context, and browser created from playwright
 */
const startBrowser = async (browserConf=noOpObj) => {
  const {
    args=noPropArr,
    type,
    active,
    url,
    ...config
  } = browserConf

  if(active === false) return noOpObj

  Logger.log(`- Starting playwright browser ${type || 'chromium'}...`)
  // Reuse or launch the playwright browser
  PW_BROWSER = PW_BROWSER ||
    await (playwright[type] || playwright.chromium).launch(
      deepMerge({
        slowMo: 50,
        devtools: true,
        headless: false,
        channel: `chrome`,
        args: flatUnion([
          `--disable-gpu`,
          `--disable-dev-shm-usage`,
          `--no-sandbox`,
          `--window-position=0,0`,
        ], args)
      }, config)
    )

  PW_CONTEXT = PW_CONTEXT || await PW_BROWSER.newContext()
  // If there's no page set, then recreate it, and goto the passed in url
  if(!PW_PAGE){
    PW_PAGE = await PW_CONTEXT.newPage()
    // Default routing to google.com
    // This helps with start times
    // By warming up the browser before it's actually used for something else
    await PW_PAGE.goto(url || `https://google.com`)
  }

  return {
    page: PW_PAGE,
    context: PW_CONTEXT,
    browser: PW_BROWSER,
  }

}

/**
 * Closes the current browser reference
 * Resets all the cache holders to null
 * @function
 * @public
 *
 * @return {Void}
 */
const stopBrowser = async () => {
  // Ensure the page and context are always reset
  PW_CONTEXT = undefined
  PW_PAGE = undefined

  // Wrap the close method incase something happens
  // We still want to reset the browser reference
  try { PW_BROWSER && await PW_BROWSER.close() }
  catch(err){ Logger.error(err.message) }

  PW_BROWSER = undefined
}

module.exports = {
  startBrowser,
  stopBrowser
}