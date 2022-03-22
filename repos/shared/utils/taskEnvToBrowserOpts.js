const { toBool, isStr, noOpObj } = require('@keg-hub/jsutils')
const { getPathFromBase } = require('./getPathFromBase')
const { parseJsonEnvArr } = require('./parseJsonEnvArr')

/**
 * Builds a list of devices to used based on the HERKIN_BROWSER_DEVICES env
 * @param {string} envVal - Value of the HERKIN_BROWSER_DEVICES env
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
    HERKIN_HEADLESS,
    HERKIN_DEV_TOOLS,
    HERKIN_BROWSER_DEVICES,
    HERKIN_SLOW_MO = `500`,
    HERKIN_BROWSER = 'chromium',
    HERKIN_BROWSER_TIMEOUT = `3000`,
    HERKIN_TRACES_DIR = getPathFromBase(herkin.paths.reportsDir, herkin),
    HERKIN_DOWNLOADS_PATH = getPathFromBase(herkin.paths.artifactsDir, herkin),
  } = process.env

  return {
    type: HERKIN_BROWSER,
    tracesDir: HERKIN_TRACES_DIR,
    devtools: toBool(HERKIN_DEV_TOOLS),
    headless: toBool(HERKIN_HEADLESS),
    downloadsPath: HERKIN_DOWNLOADS_PATH,
    slowMo: parseInt(HERKIN_SLOW_MO, 10),
    timeout: parseInt(HERKIN_BROWSER_TIMEOUT, 10),
    ...buildDeviceList(HERKIN_BROWSER_DEVICES),
  }
}

module.exports = {
  taskEnvToBrowserOpts
}