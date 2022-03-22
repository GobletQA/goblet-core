const { addToProcess } = require('./addToProcess')
const { loadConfigs } = require('@keg-hub/parse-config')

/**
 * Cache holder for the loaded envs
 * @type {Object}
 */
let __LOADED_ENVS__

/**
 * Loads the keg-herkin envs from .env and yaml values files 
 * @param {Object} options - Options for loading the env files
 * @param {boolean} [processAdd=true] - Should the envs be added to the current process
 * 
 * @returns {Object} - Loaded Envs object
 */
const loadEnvs = (options, processAdd=true) => {
  __LOADED_ENVS__ = __LOADED_ENVS__ || loadConfigs({
    name: 'herkin',
    ...options
  })

  // Add the loaded envs to the current process.env
  processAdd && addToProcess(__LOADED_ENVS__)

  return __LOADED_ENVS__
}

module.exports = {
  loadEnvs,
}
