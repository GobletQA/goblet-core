const { exists, isEmpty } = require('@keg-hub/jsutils')
const { Logger } = require('@keg-hub/cli-utils')
const { browserMap, defaultBrowser } = require('@GSC/Constants')

/**
 * Checks the passed in browserType to ensure it the correct name
 * If no type is passed, then uses the defaultBrowser ( chromium )
 * @function
 * @private
 * @param {string} browserType - Name of the browser to launch
 * @param {boolean} log - Log warning messages
 *
 * @returns {string} - Correct browser type based on passed in browserType
 */
const getBrowserType = (type, log) => {
  if (!exists(type) || isEmpty(type)) {
    log &&
      Logger.warn(
        `Browser type not defined, using default browser => ${defaultBrowser}`
      )
    return defaultBrowser
  }

  if (!browserMap[type]) {
    log &&
      Logger.warn(
        `The browser ${browser} is not allowed. Must be one of ${Object.keys(
          browserMap
        ).join(' | ')}`
      )
    return defaultBrowser
  }

  return browserMap[type]
}

module.exports = {
  getBrowserType,
}
