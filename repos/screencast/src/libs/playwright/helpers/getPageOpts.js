const path = require('path')
const { flatUnion } = require('../../utils/flatUnion')
const { checkVncEnv } = require('../../utils/vncActiveEnv')
const { getHerkinConfig } = require('HerkinConfigs/getHerkinConfig')
const { get, noPropArr, noOpObj, exists, deepMerge } = require('@keg-hub/jsutils')
const herkin = getHerkinConfig()

/**
 * Default options for a browser context
 * @type {Object}
 */
const options = {
  default: herkin?.screencast?.page,
  vnc: {
  },
  host: {
  }
}

/**
 * Builds the config for a Playwright browser page
 * @param {Object} contextConf - Playwright browser page config
 *
 * @returns {Object} - Built page config
 */
const getPageOpts = (pageConf=noOpObj) => {

  const envOpts = checkVncEnv().vncActive
    ? options.vnc
    : options.host

  return deepMerge(
    options.default,
    envOpts,
    pageConf
  )
}

module.exports = {
  getPageOpts
}