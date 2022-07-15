const { noOpObj } = require('@keg-hub/jsutils')
const { Logger } = require('@keg-hub/cli-utils')
const { browserStatus } = require('@GSC/Constants')
const { buildStatus } = require('../helpers/buildStatus')
const { getBrowserOpts } = require('../helpers/getBrowserOpts')
const { getBrowser, closeBrowser, setBrowser } = require('./browser')
/**
 * Closes the current browser reference
 * Resets all the cache holders to undefined
 * @function
 * @public
 *
 * @param {Object} browserConf - Config for a Playwright browser
 * @param {string} type - Playwright browser type ( chromium | firefox | webkit )
 *
 * @return {Void}
 */
const stopBrowser = async (browserConf = noOpObj, type) => {
  type = type || browserConf.type

  const browser = getBrowser(type)
  // Ensure the browser, page, and context are always reset
  browser && await closeBrowser(browser)

  return buildStatus(type, browserStatus.stopped)
}

module.exports = {
  stopBrowser,
}
