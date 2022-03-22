const { isArr, noOpObj } = require('@keg-hub/jsutils')

/**
 * Converts an array for key/values into an object
 */
const formatParamEnvs = envs => {
  return isArr(envs) &&
    envs.reduce((acc, env) => {
      const [key, val] = env.split(`=`)
      key && value && (acc[key.trim()] = val.trim())

      return acc
    }, {}) || noOpObj
}

module.exports = {
  formatParamEnvs
}