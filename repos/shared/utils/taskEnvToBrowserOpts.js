const { toBool, isStr, noOpObj } = require('@keg-hub/jsutils')
const { getPathFromBase } = require('./getPathFromBase')
const { parseJsonEnvArr } = require('./parseJsonEnvArr')

/**
 * Builds a list of devices to used based on the GOBLET_BROWSER_DEVICES env
 * @param {string} envVal - Value of the GOBLET_BROWSER_DEVICES env
 *
 * @returns {Array<string>} - Group of formatted device names
 */
const buildDeviceList = (envVal) => {
  if(!envVal) return noOpObj
  
  const { devices } = parseJsonEnvArr('devices', envVal)
  if(!devices) return noOpObj

  return devices.reduce((acc, device) => {
    device &&
      isStr(device) &&
      acc.devices.push(device.replace(/-/g, ' '))

    return acc
  }, {devices: []})
}

/**
 * Gets the browser opts set as envs when a task is run
 * This allows passing values into the test environment
 * @param {Object} herkin - Herkin global config
 *
 * @return {Object} browser options
 */
const taskEnvToBrowserOpts = herkin => {
  const {
    GOBLET_HEADLESS,
    GOBLET_DEV_TOOLS,
    GOBLET_BROWSER_DEVICES,
    GOBLET_SLOW_MO = `500`,
    GOBLET_BROWSER = 'chromium',
    GOBLET_BROWSER_TIMEOUT = `3000`,
    GOBLET_TRACES_DIR = getPathFromBase(herkin.paths.reportsDir, herkin),
    GOBLET_DOWNLOADS_PATH = getPathFromBase(herkin.paths.artifactsDir, herkin),
  } = process.env

  return {
    type: GOBLET_BROWSER,
    tracesDir: GOBLET_TRACES_DIR,
    devtools: toBool(GOBLET_DEV_TOOLS),
    headless: toBool(GOBLET_HEADLESS),
    downloadsPath: GOBLET_DOWNLOADS_PATH,
    slowMo: parseInt(GOBLET_SLOW_MO, 10),
    timeout: parseInt(GOBLET_BROWSER_TIMEOUT, 10),
    ...buildDeviceList(GOBLET_BROWSER_DEVICES),
  }
}

module.exports = {
  taskEnvToBrowserOpts
}