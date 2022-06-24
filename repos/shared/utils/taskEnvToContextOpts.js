const { getScreenDims } = require('./getScreenDims')
const { parseJsonEnvArr } = require('./parseJsonEnvArr')
const {
  toBool,
  isArr,
  noOpObj,
  isNum,
  exists,
  isObj
} = require('@keg-hub/jsutils')

/**
 * Parses the GOBLET_CONTEXT_GEO env into an object 
 * @param {*} value - Value of the context options
 * 
 * @returns {Object} - Updated opts object with geolocation added if set
 */
const parseGeo = value => {
  if(!exists(value)) return noOpObj
  const {geo} = parseJsonEnvArr('geo', value)

  // Only add geo if it's the correct type, and it has a value
  if(!geo || !isArr(geo) || !geo.length) return noOpObj

  // Same order as how it should be entered from the cmd line lat,long,acc
  return [`latitude`, `longitude`, `accuracy`].reduce((acc, key, idx) => {
    const parsed = parseInt(geo[idx])
    if(!isNum(parsed)) return acc
    
    acc.geolocation = acc.geolocation || {}
    acc.geolocation[key] = parsed

    return acc
  }, {})
}

/**
 * Check's the passed in value, and adds it to the options if it exists
 * @param {Object} opts - Context options being built
 * @param {string} key - Property key name of the option
 * @param {*} value - Value of the context options
 * 
 * @returns {Object} - Updated opts object with property added when it exists
 */
const addEnvToOpts = (opts, key, value) => {
  exists(value) && (opts[key] = value)

  return opts
}

/**
 * Parses the GOBLET_CONTEXT_RECORD env, and sets the height and width if true
 * @param {Object} opts - Context options being built
 * @param {boolean} value - True if recording should be turned on
 * @param {Object} screenDims - Screen dimensions of the browser
 * 
 * @returns {Object} - Updated opts object with recording settings
 */
const parseRecord = (opts, value, screenDims) => {
  exists(value) &&
    value &&
    isObj(screenDims) &&
    (opts.recordVideo = {screenDims})

  return opts
}

/**
 * Gets the browser opts set as envs when a task is run
 * This allows passing values into the test environment
 * @param {Object} config - Herkin global config
 *
 * @return {Object} browser options
 */
const taskEnvToContextOpts = config => {
  const {
    GOBLET_CONTEXT_TZ, // string
    GOBLET_CONTEXT_RECORD, // boolean
    GOBLET_CONTEXT_TOUCH, // boolean
    GOBLET_CONTEXT_MOBILE, // boolean
    GOBLET_CONTEXT_DOWNLOADS, // boolean
    GOBLET_CONTEXT_GEO, // JSON array
    GOBLET_CONTEXT_PERMISSIONS,  // JSON array
  } = process.env

  const opts = {
    ...parseJsonEnvArr('permissions', GOBLET_CONTEXT_PERMISSIONS),
    ...parseGeo(GOBLET_CONTEXT_GEO),
  }

  addEnvToOpts(opts, 'timezoneId', GOBLET_CONTEXT_TZ)
  addEnvToOpts(opts, 'hasTouch', toBool(GOBLET_CONTEXT_TOUCH))
  addEnvToOpts(opts, 'isMobile', toBool(GOBLET_CONTEXT_MOBILE))
  addEnvToOpts(opts, 'acceptDownloads', toBool(GOBLET_CONTEXT_DOWNLOADS))

  const screenDims = getScreenDims()
  parseRecord(opts, toBool(GOBLET_CONTEXT_RECORD), screenDims)

  if(screenDims.height || screenDims.width){
    addEnvToOpts(opts, 'viewport', screenDims)
    addEnvToOpts(opts, 'screen', screenDims)
  }

  return opts
}

module.exports = {
  taskEnvToContextOpts
}