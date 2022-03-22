const { exists } = require('@keg-hub/jsutils')

/**
 * Loop over the merged ENVs
 * Add them to the process.env if they don't already exist
 * @param {Object} addEnvs - Envs to add to the current process
 *
 */
const addToProcess = addEnvs => {
  Object.entries(addEnvs).map(([key, value]) => {
    exists(value) && !exists(process.env[key]) && (process.env[key] = value)
  })
}

module.exports = {
  addToProcess,
}
