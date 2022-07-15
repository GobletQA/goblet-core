const path = require('path')
const { getGobletConfig } = require('@GSH/Config')
const { getRepoGobletDir } = require('@GSH/Utils/getRepoGobletDir')
const { taskEnvToBrowserOpts } = require('@GSH/Utils/taskEnvToBrowserOpts')
const { checkVncEnv } = require('../../utils/vncActiveEnv')
const {
  exists,
  noOpObj,
  omitKeys,
  flatUnion,
  noPropArr,
  deepMerge,
} = require('@keg-hub/jsutils')

/**
options
  args: [],
  channel: ''
  chromiumSandbox: ''
  devtools: true,
  env: {},
  executablePath: '
  firefoxUserPrefs: {}
  handleSIGHUP: true
  handleSIGINT: true
  handleSIGTERM: true
  headless: true,
  ignoreDefaultArgs: false
  logger: Logger Object
  proxy: Proxy Object
    server: ''
    bypass: ''
    username: ''
    password: ''
  slowMo: 0
  timeout: 3000
  wsPath: '/custom-ws-path' (to serve websocket)
  tracesDir: /goblet/artifacts/traces
  downloadsPath: /goblet/artifacts/downloads
*/

/**
 * Default browser optons
 * @type {Object}
 */
const options = {
  host: {},
  vnc: {
    slowMo: 100,
    headless: false,
    args: [
      `--disable-gpu`,
      `--disable-dev-shm-usage`,
      `--no-sandbox`,
      `--window-position=0,0`,
    ],
  },
}

const getGobletConfigOpts = config => {
  const {
    tracesDir = 'artifacts/traces',
    downloadsDir = 'artifacts/downloads',
  } = config.paths

  const baseDir = getRepoGobletDir(config)
  return {
    ...config?.screencast?.browser,
    tracesDir: path.join(baseDir, tracesDir),
    downloadsPath: path.join(baseDir, downloadsDir),
  }
}

/**
 * Builds the config for the browser merging the defaults with the passed in config
 * @function
 * @public
 * @param {Object} browserConf - Options to define how the browser starts
 * @param {Object} config - Global config config object
 *
 * @return {Object} - Config object to pass to playwright when starting a browser
 */
const getBrowserOpts = (browserConf=noOpObj, config) => {
  const {
    channel,
    restart,
    headless,
    // Config for creating a browser context
    // Should not be included in the browser options
    context,
    args = noPropArr,
    // type / url is not used, just pulled out of the config object
    type,
    url,
    ...argumentOpts
  } = browserConf

  config = config || getGobletConfig()
  const { args: configModeArgs, ...configModeOpts } = checkVncEnv().vncActive
    ? options.vnc
    : options.host

  return deepMerge(
    /**
     * Gets the default config options from the global goblet.config.js
     */
    getGobletConfigOpts(config),
    /**
     * Default options set based on the config mode i.e. local || vnc
     */
    configModeOpts,
    /**
     * Generated options passed on passed in arguments
     * Allows only setting properties if they actually exist
     */
    {
      args: flatUnion(configModeArgs, args),
      ...(exists(headless) && { headless }),
      ...(exists(channel) && { channel }),
    },
    /**
     * Options passed to this function as the first argument
     * Should override all except for options set by a task via ENVs
     */
    argumentOpts,
    /**
     * Task env opts overrides all others
     * These come from the options passed to a task that started the process
     * This ensures those options gets set
     * Also, excludes the devices list from the returned Object
     */
     omitKeys(taskEnvToBrowserOpts(config), ['devices']),
  )
}

module.exports = {
  getBrowserOpts,
}
