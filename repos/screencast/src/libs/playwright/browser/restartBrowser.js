const { stopBrowser } = require('./stopBrowser')
const { startBrowser } = require('./startBrowser')

/**
 * Helper method to stop the currently running browser, and start a new one
 * @function
 * @public
 * @param {Object} browserConf - Config passed to the browser on launch (see startBrowser method)
 *
 * @returns {Object} - Contains the page, context, and browser created from playwright
 */
const restartBrowser = async browserConf => {
  await stopBrowser(browserConf)
  return await startBrowser(browserConf)
}

module.exports = {
  restartBrowser,
}
