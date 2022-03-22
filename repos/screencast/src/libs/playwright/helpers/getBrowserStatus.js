const { buildStatus } = require('./buildStatus')
const { browserStatus } = require('HerkinSCConstants')
const { getBrowserType } = require('./getBrowserType')
const { restartBrowser } = require('../browser/restartBrowser')
const { checkCall, noOpObj } = require('@keg-hub/jsutils')
const { getPage, getContext, getBrowser } = require('../browser/browser')

/**
 * Starts a Playwright Browser using the passed in params as launch options
 * @function
 * @public
 * @param {Object} [browserConf=noOpObj] - Config used when launching the browser via playwright
 * @param {Array} browserConf.args - Arguments to pass to the browser on launch
 * @param {string} browserConf.type - The browser type to check [chromium|firefox]
 * @param {Object} browserConf.config - Options to pass to the browser on launch
 * @param {Object} [browser] - Playwright Browser object
 * @param {Object} [context] - Playwright Browser context object
 * @param {Object} [page] - Playwright Browser page object
 *
 * @return {Object} - Status of the browser, with status and message properties
 */
const getBrowserStatus = async (
  browserConf = noOpObj,
  browser,
  context,
  page
) => {
  // Ensure we have a type to look for
  const type = getBrowserType(browserConf.type)

  // Ensure we have the page, context, and browser for the browser type
  page = page || getPage(type)
  context = context || getContext(type)
  browser = browser || getBrowser(type)

  // Check if we have all needed items for the browser to be considered running
  return Boolean(browser && context && page)
    ? buildStatus(type, browserStatus.running)
    : // If not running, should we try to restart it
    // If not return the stopped status
    !browserConf.restart
    ? buildStatus(type, browserStatus.stopped)
    : // If restart is true, then try to restart the browser
      await checkCall(async () => {
        const res = await restartBrowser(browserConf)

        // After the restart, ensure it was successful
        return Boolean(res.browser && res.context && res.page)
          ? buildStatus(type, browserStatus.running)
          : buildStatus(
              type,
              browserStatus.stopped,
              `${getBrowserType(browserConf.type)} Browser could not be started`
            )
      })
}

module.exports = {
  buildStatus,
  getBrowserStatus,
}
