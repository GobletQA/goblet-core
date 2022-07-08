const express = require('express')
const { getHerkinConfig, resetHerkinConfig } = require('GobletSharedConfig')

let _APP

/**
 * Reloads the herkin config be deleting the current config and calling getHerkinConfig
 * Does not reset the _CONFIG_TYPE, so the same type is loaded every time
 * @function
 * @public
 * @param {string} [type] - Property on the herkin config that contains the server config
 *
 * @returns {void}
 */
const reloadHerkinConfig = type => {
  // Remove the old config
  resetHerkinConfig()
  delete _APP.locals.config

  // Reload the app with the config
  setupApp(type)
}

/**
 * Adds the herkin config to the app based on the type
 * @function
 * @public
 * @param {string} [type] - Property on the herkin config that contains the server config
 *
 * @returns {Object} - Express App Object
 */
const setupApp = type => {
  !_APP.locals.config && (_APP.locals.config = getHerkinConfig())

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
  reloadHerkinConfig,
}
