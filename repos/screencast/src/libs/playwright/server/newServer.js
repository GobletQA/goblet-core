const playwright = require('playwright')
const { setServer } = require('./server')
const { noOpObj } = require('@keg-hub/jsutils')
const metadata = require('../helpers/metadata')
const { Logger } = require('@keg-hub/cli-utils')
const { getBrowserOpts } = require('../helpers/getBrowserOpts')

/**
 * Starts new browser server using the Playwright API
 * @function
 * @private
 * @param {string} browser - Name of the browser to launch
 * @param {Object} browserConf - Browser server config
 *
 * @returns {Object} - Browser server reference
 */
const newServer = async (browser, browserConf = noOpObj) => {
  Logger.log(`- Starting playwright server ${browser}...`)
  // Launch the playwright server
  const launchOpts = getBrowserOpts(browserConf)
  const pwServer = await playwright[browser].launchServer(launchOpts)

  Logger.log(`- Configuring browser ${browser} websocket...`)
  const wsEndpoint = pwServer.wsEndpoint()

  Logger.empty()
  Logger.pair(`Browser Server websocket endpoint is`, wsEndpoint)
  Logger.empty()

  // Save the playwright browser metadata to the <os-temp>/browser-meta.json, to be used for future connections
  await metadata.save(browser, wsEndpoint, launchOpts)

  return setServer(pwServer)
}

module.exports = {
  newServer,
}
