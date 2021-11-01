const path = require('path')
const { flatUnion } = require('../../utils/flatUnion')
const { checkVncEnv } = require('../../utils/vncActiveEnv')
const { getHerkinConfig } = require('HerkinConfigs/getHerkinConfig')
const { get, noPropArr, noOpObj, exists, deepMerge } = require('@keg-hub/jsutils')
const herkin = getHerkinConfig()
const testsRoot = get(herkin, 'paths.testsRoot')
const tracesDir = path.join(testsRoot, get(herkin, 'paths.reportsDir', 'reports'))
const downloadsPath = path.join(testsRoot, get(herkin, 'paths.artifactsDir', 'artifacts'))

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
  tracesDir: reportsDir
  downloadsPath: artifactsDir
*/

/**
 * Default browser optons
 * @type {Object}
 */
const options = {
  default: {
    ...herkin?.screencast?.browser,
    tracesDir,
    downloadsPath,
  },
  host: {
  },
  vnc: {
    slowMo: 50,
    headless: false,
    args: [
      `--disable-gpu`,
      `--disable-dev-shm-usage`,
      `--no-sandbox`,
      `--window-position=0,0`,
    ]
  },
}


/**
 * Builds the config for the browser merging the defaults with the passed in config
 * @function
 * @public
 * @param {Object} browserConf - Options to define how the browser starts
 *
 * @return {Object} - Config object to pass to playwright when starting a browser
 */
const getBrowserOpts = (browserConf=noOpObj) => {
  const {
    url,
    channel,
    restart,
    headless,
    // Config for creating a browser context
    // Should not be included in the browser options
    context,
    args=noPropArr,
    type='chromium',
    ...config
  } = browserConf

  const { args:envArgs, ...envOpts } = checkVncEnv().vncActive
    ? options.vnc
    : options.host

  return deepMerge(
    options.default,
    envOpts,
    {
      args: flatUnion(envArgs, args),
      ...(exists(headless) && { headless }),
      ...(exists(channel) && { channel }),
    },
    config
  )
}

module.exports = {
  getBrowserOpts
}