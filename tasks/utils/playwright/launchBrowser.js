#!/usr/bin/env node

/**
 * Script should be run on the HOST machine, NOT with in the docker container
 * Starts the playwright chromium server on the HOST machine,
 * The `wsEndpoint` is then passed to the docker container as an ENV - BROWSER_WS_ENDPOINT
 */
const { Logger, inDocker } = require('@keg-hub/cli-utils')
const metadata = require('@GSC/Playwright/helpers/metadata')
const { newServer } = require('@GSC/Playwright/server/newServer')
const { noOpObj, exists, isEmpty, limbo } = require('@keg-hub/jsutils')
const { newBrowserWS } = require('@GSC/Playwright/browser/newBrowser')
const { getBrowserType } = require('@GSC/Playwright/helpers/getBrowserType')

/**
 * Logs a highlighted message
 * @param {string} start - Start of message
 * @param {string} middle - Part of message highlighted
 * @param {string} end - End of message
 * @param {boolean} [log] - Should the message be logged
 *
 */
const logHighlight = (start, middle, end, log = true) => {
  log && Logger.highlight(`\n==== ${start}`, middle, `${end} ====`)
}

/**
 * Gets the browser name for logs
 * Adds headless to the browser type if it's true
 * @param {boolean} headless - Is headless mode enabled
 * @param {String} type - one of 'chromium', 'firefox', or 'webkit'
 */
const getBrowserName = (headless, type) =>
  `${headless ? 'headless ' : ''}${type}`

/**
 * Checks if inside a docker container, and it so, throws an error
 * @throws
 * @param {Object} endpoint - Saved metadata websocket endpoint from a previous launch
 */
const inDockerErr = endpoint => {
  if (!inDocker()) return

  endpoint = endpoint.replace('127.0.0.1', 'host.docker.internal')
  throw new Error(`Could not connect to the browser at ${endpoint}. Exiting...`)
}

/**
 * Check to see if the previous launch parameters match the current ones
 * @param {Object} browserMeta - Saved metadata from a previous launch
 * @param {Object} launchOptions - see: https://playwright.dev/docs/api/class-browsertype?_highlight=launch#browsertypelaunchserveroptions
 * @param {String} browserType - one of 'chromium', 'firefox', or 'webkit'
 *
 * @return {boolean} True if the launchParams are the same
 */
const checkLaunchParams = (browserMeta, launchOptions, browserType) => {
  return (
    !isEmpty(browserMeta.endpoint) &&
    browserType === browserMeta.type &&
    launchOptions.headless === browserMeta.launchOptions.headless &&
    launchOptions.slowMo === browserMeta.launchOptions.slowMo
  )
}

/**
 * If launch params match, then just try connecting to that launched
 * browser. If you can connect, close the connection and do nothing else.
 * @param {Object} launchOptions - see: https://playwright.dev/docs/api/class-browsertype?_highlight=launch#browsertypelaunchserveroptions
 * @param {String} browserType - one of 'chromium', 'firefox', or 'webkit'
 * @param {boolean} paramsMatch - True if the passed params match the metadata params
 * @param {boolean} log - if true, logs out stages of launch
 *
 * @return {boolean} True if we can connect to the browser
 */
const testBrowserConnection = async (
  launchOptions,
  browserType,
  paramsMatch,
  log
) => {
  if (!paramsMatch) return

  const [err, browser] = await limbo(
    newBrowserWS({ type: browserType, ...launchOptions }, false)
  )

  if (!err && browser.isConnected()) {
    browser.close()
    return true
  }
}

/**
 * Launches the browser server instance of the browserType and launch options
 * @param {String} browserType - one of 'chromium', 'firefox', or 'webkit'
 * @param {Object} launchOptions - see: https://playwright.dev/docs/api/class-browsertype?_highlight=launch#browsertypelaunchserveroptions
 * @param {boolean} log - if true, logs out stages of launch
 *
 * @returns {Object} - Browser server instance
 */
const launchBrowserServer = async (browserType, launchOptions, log) => {
  const browserMeta = await metadata.read(browserType)
  const paramsMatch = checkLaunchParams(browserMeta, launchOptions, browserType)
  const canConnect = await testBrowserConnection(
    launchOptions,
    browserType,
    paramsMatch,
    log
  )
  const name = getBrowserName(launchOptions.headless, browserType)

  if (canConnect)
    return logHighlight(
      `Using previously-launched`,
      name,
      `on host machine...`,
      log
    )

  // If we can't connect, and we're inside docker, throw an error
  inDockerErr(browserMeta.endpoint)

  // Otherwise, try to launch the browser.
  logHighlight(`Starting`, name, `on host machine..`, log)

  return newServer(browserType, launchOptions)
}

/**
 * Starts a Playwright Browser Server.
 * <br/> Then gets the websocket endpoint for the server,
 * <br/> For a list of all options, [Go here](https://playwright.dev/docs/api/class-browsertype/#browsertypelaunchoptions)
 * @function
 * @export
 * @param {Object} config - Config for the browser server
 * @param {boolean} [config.log=true] - Log the websocket endpoint
 * @param {string} [config.browser='chromium'] - Browser type to start
 * @param {Array} [config.browsers=[All browsers]] - Allowed browser to use
 * @param {Object} [config.headless=false] - Run the browser in headless mode
 *
 * @returns {string} - Websocket endpoint of the started browser server
 */
const launchBrowser = async (config = noOpObj) => {
  const {
    log = true,
    browser = 'chromium',
    allowed = ['chromium', 'firefox', 'webkit'],
    ...params
  } = config

  const launchParams = {
    headless: exists(config.headless) ? config.headless : true,
    ...params,
  }

  const browserType = getBrowserType(browser)
  const browserServer = await launchBrowserServer(
    browserType,
    launchParams,
    log
  )
  if (!browserServer) return

  const wsEndpoint = browserServer.wsEndpoint()
  if (!wsEndpoint)
    throw new Error(
      `Could not get the websocket endpoint from the browser server!`
    )

  return wsEndpoint
}

module.exports = {
  launchBrowser,
}
