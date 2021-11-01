const path = require('path')
const { flatUnion } = require('../../utils/flatUnion')
const { checkVncEnv } = require('../../utils/vncActiveEnv')
const { getHerkinConfig } = require('HerkinConfigs/getHerkinConfig')
const { get, noPropArr, noOpObj, exists, deepMerge } = require('@keg-hub/jsutils')
const herkin = getHerkinConfig()

const {
  VNC_VIEW_HEIGHT=900,
  VNC_VIEW_WIDTH=1440
} = process.env

/**
 * Default options for a browser context
 * @type {Object}
 */
const options = {
  default: herkin?.screencast?.context,
  vnc: {
    viewport: {
      width: parseInt(VNC_VIEW_WIDTH, 10),
      height: parseInt(VNC_VIEW_HEIGHT, 10),
      // Let the config override the ENV if it's set
      ...herkin?.screencast?.context.viewport
    }
  },
  host: {
  }
}

/**
 * Builds the config for a Playwright browser context
 * @param {Object} contextConf - Playwright browser context config
 *
 * @returns {Object} - Built context config
 */
const getContextOpts = (contextConf=noOpObj) => {

  const envOpts = checkVncEnv().vncActive
    ? options.vnc
    : options.host

  return deepMerge(
    options.default,
    envOpts,
    contextConf
  )
}

module.exports = {
  getContextOpts
}