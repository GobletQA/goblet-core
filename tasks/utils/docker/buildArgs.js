const {
  isObj,
  reduceObj,
  isArr,
  noPropArr,
  noOpObj,
} = require('@keg-hub/jsutils')

/**
 * Converts a key and value into docker build-args ( --build-arg key=value )
 * @function
 * @param {Object} key - Name of the build-arg
 * @param {Object} value - value of the build-arg
 * @param {string} [cmd=''] - Cmd to add the build-args to
 * @param {Array} [filters=[]] - Filter out specific envs items
 *
 * @returns {string} - Passed in cmd, with the key/value converted to docker build-args
 */
const asBuildArgStr = (key, value, cmd = '', filters) => {
  filters = isArr(filters) ? filters : noPropArr

  return !filters.includes(key) && value
    ? `${cmd} --build-arg ${key}=${value}`.trim()
    : cmd
}

const asBuildArgArr = (key, value, buildArgArr, filters) => {
  filters = isArr(filters) ? filters : noPropArr

  !filters.includes(key) &&
    value &&
    buildArgArr.push(`--build-arg`, `${key}=${value}`)

  return buildArgArr
}

/**
 * Converts an object into docker build-args ( --build-arg key=value )
 * @function
 * @param {Object} [envs={}] - Envs to be converted
 * @param {string} [cmd=''] - Cmd to add the build-args to
 * @param {Array} [filters=[]] - Filter out specific envs items
 *
 * @returns {string} - Passed in cmd, with the envs converted to docker build-args
 */
const toBuildArgsStr = (envs = noOpObj, filters = noPropArr, cmd = '') => {
  return !isObj(envs)
    ? cmd
    : reduceObj(
        envs,
        (key, value, buildCmd) => asBuildArgStr(key, value, buildCmd, filters),
        cmd
      )
}

const toBuildArgsArr = (envs = noOpObj, filters = noPropArr, buildArr = []) => {
  const built = reduceObj(
    envs,
    (key, value, buildArr) => asBuildArgArr(key, value, buildArr, filters),
    buildArr
  )
  return built
}

module.exports = {
  toBuildArgsStr,
  toBuildArgsArr,
  asBuildArgStr,
  asBuildArgArr,
  toBuildArgs: toBuildArgsStr,
}
