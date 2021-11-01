const express = require('express')
const { getHerkinConfig } = require('HerkinConfigs/getHerkinConfig')

let _APP

/**
 * Adds the herkin config to the app based on the type
 * @function
 * @public
 * @param {string} [type] - Property on the herkin config that contains the server config
 *
 * @returns {Object} - Express App Object
 */
const setupApp = type => {
  if(_APP.locals.config) return _APP

  const config = getHerkinConfig()
  _APP.locals.config = type && config[type]
    ? config[type]
    : config
  
  return _APP
}

/**
 * Initializes an Express app if it does not already exist
 * @function
 * @public
 *
 * @returns {Object} - Express App Object
 */
const getApp = (type) => {
  !_APP && (_APP = express())

  return setupApp(type)
}

module.exports = {
  getApp
}