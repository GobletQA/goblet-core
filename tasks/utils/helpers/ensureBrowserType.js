const { exists } = require('@keg-hub/jsutils')
const { browserNames } = require('../../constants')

/**
 * Ensures the browser type is supported
 * @function
 * @private
 * @param {string} browser - Name of the browser to be started
 * @param {Array} allowed - List of allowed browsers
 *
 * @returns {void}
 */
const ensureBrowserType = (browser, allowed = browserNames) => {
  if (exists(browser) && !allowed.includes(browser))
    throw new Error(
      `The browser ${browser} is not allowed. Must be one of ${allowed.join(
        ' | '
      )}`
    )

  return browser
}

module.exports = {
  ensureBrowserType,
}
