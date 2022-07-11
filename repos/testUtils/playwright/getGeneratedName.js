const { noOpObj, get } = require('@keg-hub/jsutils')

const nameCache = {}

/**
 * Gets the name of the most recently run test
 * @param {string} override - Override the name pulled from jasmine global object
 *
 * @returns {Object} - Contains the short name and full generated path name
 */
const getGeneratedName = (override) => {
  const { testType } = get(global, `__goblet.options`, noOpObj)
  const timestamp = new Date().getTime()

  // TODO: see if theres a better way to get the test name from the jasmine api
  // Get the name of the file being tested and set it here
  const name = (override || global.jasmine.testPath || testType).split(`/`)
    .pop()
    .split('.')
    .shift()
    .trim()
    .replace(/ /g, '-')

  // Use a cache name to ensure all generated artifacts use the same timestamp
  const cacheName = `${testType}-${name}`
  if(nameCache[cacheName]) return nameCache[cacheName]

  const nameTimestamp = `${name}-${timestamp}`

  nameCache[cacheName] = {
    name,
    nameTimestamp,
    dir: `${testType}/${name}`,
    full: `${testType}/${name}/${nameTimestamp}`,
  }

  return nameCache[cacheName]
}

module.exports = {
  getGeneratedName
}