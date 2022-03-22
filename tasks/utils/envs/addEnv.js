const { exists } = require('@keg-hub/jsutils')

/**
 * Adds an env's value to the envs object when checkVal exists
 * @param {Object} envs - Object to add the env to
 * @param {String} key - Name of the env to add
 * @return {String} checkVal - Value to check if it exists (ENV's value)
 * @return {String} [useVal=checkVal] - Value to use if checkVal exists (ENV's value)
 */
 const addEnv = (envs, key, checkVal, useVal=checkVal) => {
  exists(checkVal) && (envs[key] = useVal)

  return envs
}


module.exports = {
  addEnv
}