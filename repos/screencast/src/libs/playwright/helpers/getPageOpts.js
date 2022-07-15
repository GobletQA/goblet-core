const { noOpObj, deepMerge } = require('@keg-hub/jsutils')
const { checkVncEnv } = require('../../utils/vncActiveEnv')
const { getGobletConfig } = require('@GSH/Config')

/**
 * Default options for a browser context
 * @type {Object}
 */
const options = {
  vnc: {},
  host: {},
}

/**
 * Builds the config for a Playwright browser page
 * @param {Object} contextConf - Playwright browser page config
 *
 * @returns {Object} - Built page config
 */
const getPageOpts = (pageConf = noOpObj) => {
  const goblet = getGobletConfig()

  return deepMerge(
    goblet?.screencast?.page,
    checkVncEnv().vncActive ? options.vnc : options.host,
    pageConf
  )
}

module.exports = {
  getPageOpts,
}
