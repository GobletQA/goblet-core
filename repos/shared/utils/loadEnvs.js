const path = require('path')
const { addToProcess } = require('@keg-hub/cli-utils')

const appRoot = path.join(__dirname, '../../../')

const testRemovePrefix = [
  'KEG_',
  'DOC_',
  'GOBLET_JWT_',
  'GITHUB_'
]

const testRemoveIncludes = [
  'SECRET',
  'TOKEN',
  'PASSWORD'
]

/**
 * Cache holder for the loaded envs
 * @type {Object}
 */
let __LOADED_ENVS__

/**
 * Loads the goblet envs from .env and yaml values files 
 * @param {Object} options - Options for loading the env files
 * @param {boolean} [processAdd=true] - Should the envs be added to the current process
 * 
 * @returns {Object} - Loaded Envs object
 */
const loadEnvs = (processAdd) => {
  const nodeEnv = process.env.NODE_ENV || `local`

  if(process.env.JEST_WORKER_ID !== undefined){
    Object.entries(process.env)
      .map(([key, val ]) => {
        const shouldRemove = testRemovePrefix.find(prefix => key.startsWith(prefix)) ||
          testRemoveIncludes.find(word => key.includes(word))

        if(!shouldRemove) return

        process.env[key] = undefined
        delete process.env[key]
      })

    return {}
  }

  __LOADED_ENVS__ = __LOADED_ENVS__ || require('@keg-hub/parse-config').loadConfigs({
    env: nodeEnv,
    name: 'goblet',
    locations: [appRoot],
  })

  // Add the loaded envs to process.env if processAdd is set
  // Or env if local, and processAdd is not explicitly set to false
  addToProcess(__LOADED_ENVS__, {force: processAdd || (nodeEnv === 'local' && processAdd !== false)})

  return __LOADED_ENVS__
}

module.exports = {
  loadEnvs,
}
