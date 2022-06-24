/**
 * Type map for browser launchTypes
 * @type {Object}
 */
const launchMap = {
  s: 'SERVER',
  server: 'SERVER',
  l: 'LAUNCH',
  launch: 'LAUNCH',
  p: 'PERSISTENT',
  persistent: 'PERSISTENT',
}

/**
 * Method name map for playwright browser launch methods
 * @type {Object}
 */
const launchMethodMap = {
  launch: 'launch',
  server: 'launchServer',
  persistent: 'launchPersistentContext',
}

/**
 * Gets the launch type to use when launching the browser 
 * Normalizes the launchType argument to allow shortcuts
 * 
 * @param {string} [launchType] - The browser launchType to use
 * 
 * @returns {string} - The found browser launchType
 */
const getLaunchType = (launchType) => {
  launchType = launchType ||
    process.env.GOBLET_BROWSER_LAUNCH_TYPE ||
    'launch'

  return launchType && launchMap[launchType.toLowerCase()] || launchMap.launch
}

/**
 * Gets the playwright method name used to launch the browser 
 * Normalizes the launchType argument to allow shortcuts
 * 
 * @param {string} [launchType] - The browser launchType to use
 * 
 * @returns {string} - The name of the playwright launchType method
 */
const getLaunchTypeMethod = (launchType) => {
  const lType = getLaunchType(launchType).toLowerCase()
  return launchMethodMap[lType] || launchMethodMap.launch
}

module.exports = {
  getLaunchType,
  getLaunchTypeMethod
}