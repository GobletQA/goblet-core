const {
  isStr,
  isArr,
  exists,
  noOpObj,
} = require('@keg-hub/jsutils')

/**
 * Parses a json stringified object
 * @param {string} key - Property key name of the option
 * @param {*} value - Value of the context options
 * 
 * @returns {Object} - Object with property added when it exists
 */
const parseJsonEnvArr = (key, value) => {
  if(!exists(value)) return noOpObj
  if(isArr(value)) return {[key]: value}
  try {
    const parsed = JSON.parse(value)
    /**
     * Only add the parsed value if it's an array
     * And it's got a value
     */
    return isArr(parsed) && parsed.length
      ? { [key]: JSON.parse(value) }
      : noOpObj
  }
  catch (e){
    /**
     * Only try to split if it's a non-empty string 
     */
    return isStr(value) && value.length
      ? {[key]: value.split(',')}
      : noOpObj
  }
}

module.exports = {
  parseJsonEnvArr
}