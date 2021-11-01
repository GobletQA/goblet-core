const { newPage } = require('./newPage')
const { getPage, getContext, getBrowser } = require('./browser')

/**
 * Starts browser using playwright
 * See {@link https://playwright.dev/docs/api/class-browsertype#browser-type-launch|Playwright Docs} for more info
 * @function
 * @public
 * @param {Object} browserConf - Config used when launching the browser via playwright
 * @param {Array} browserConf.args - Arguments to pass to the browser on launch
 * @param {string} browserConf.type - Name of the browser to launch
 * @param {string} [browserConf.url=https://google.com] - Initial url the browser should navigate to
 * @param {Object} browserConf.config - Options to pass to the browser on launch
 *
 * @returns {Object} - Contains the page, context, and browser created from playwright
 */
const startBrowser = async (browserConf=noOpObj) => {
  await newPage(browserConf)

  return {
    page: getPage(browserConf.type),
    context: getContext(browserConf.type),
    browser: getBrowser(browserConf.type),
  }
}


module.exports = {
  startBrowser
}