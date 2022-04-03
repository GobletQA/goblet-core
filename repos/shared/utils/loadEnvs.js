const { exists } = require('@keg-hub/jsutils')
const { loadConfigs } = require('@keg-hub/parse-config')

const path = require('path')
const appRoot = path.join(__dirname, '../../../')
const nodeEnv = process.env.NODE_ENV || `local`

/**
 * Loop over the merged ENVs
 * Add them to the process.env if they don't already exist
 * @param {Object} addEnvs - Envs to add to the current process
 *
 */
const addToProcess = (addEnvs, force) => {
  Object.entries(addEnvs).map(([key, value]) => {
    exists(value) &&
      (!exists(process.env[key]) || force) &&
      (process.env[key] = value)
  })
}


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
const loadEnvs = (processAdd) => {
  __LOADED_ENVS__ = __LOADED_ENVS__ || loadConfigs({
    env: nodeEnv,
    name: 'herkin',
    locations: [appRoot],
  })

  // Add the loaded envs to process.env if processAdd is set
  // Or env if local, and processAdd is not explicitly set to false
  addToProcess(__LOADED_ENVS__, processAdd || (nodeEnv === 'local' && processAdd !== false))

  return __LOADED_ENVS__
}

module.exports = {
  loadEnvs,
}
