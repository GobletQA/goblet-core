const express = require('express')
const { getGobletConfig, resetGobletConfig } = require('@GSH/Config')

let _APP

/**
 * Reloads the goblet config be deleting the current config and calling getGobletConfig
 * Does not reset the _CONFIG_TYPE, so the same type is loaded every time
 * @function
 * @public
 * @param {string} [type] - Property on the goblet config that contains the server config
 *
 * @returns {void}
 */
const reloadGobletConfig = type => {
  // Remove the old config
  resetGobletConfig()
  delete _APP.locals.config

  // Reload the app with the config
  setupApp(type)
}

/**
 * Adds the goblet config to the app based on the type
 * @function
 * @public
 * @param {string} [type] - Property on the goblet config that contains the server config
 *
 * @returns {Object} - Express App Object
 */
const setupApp = type => {
  !_APP.locals.config && (_APP.locals.config = getGobletConfig())

  return _APP
}

/**
 * Initializes an Express app if it does not already exist
 * @function
 * @public
 *
 * @returns {Object} - Express App Object
 */
const getApp = type => {
  !_APP && (_APP = express())

  return setupApp(type)
}

module.exports = {
  getApp,
  reloadGobletConfig,
}
