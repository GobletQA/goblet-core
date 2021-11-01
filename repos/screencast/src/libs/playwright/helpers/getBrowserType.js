const { browserMap, defaultBrowser } = require('HerkinSCConstants')

/**
 * Checks the passed in browserType to ensure it the correct name
 * If no type is passed, then uses the defaultBrowser ( chromium )
 * @function
 * @private
 * @param {string} browserType - Name of the browser to launch
 *
 * @returns {string} - Correct browser type based on passed in browserType
 */
const getBrowserType = type => {
  return  browserMap[type] || defaultBrowser
}

module.exports = {
  getBrowserType
}