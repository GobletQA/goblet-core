const playwright = require('playwright')
const { Logger } = require('@keg-hub/cli-utils')
const { getMetadata } = require('../server/server')
const { inDocker } = require('../../utils/inDocker')
const { flatUnion } = require('../../utils/flatUnion')
const { getBrowser, setBrowser } = require('./browser')
const { statusServer, startServer } = require('../server')
const { checkVncEnv } = require('../../utils/vncActiveEnv')
const { getBrowserOpts } = require('../helpers/getBrowserOpts')
const { getBrowserType } = require('../helpers/getBrowserType')
const { noOpObj, noPropArr, deepMerge, limbo } = require('@keg-hub/jsutils')

/**
 * Starts new browser by connecting to an existing browser server websocket
 * @function
 * @private
 * @param {string} browserType - Name of the browser to launch
 * @param {Array} args - Arguments to pass to the browser on launch
 * @param {Object} config - Options to pass to the browser on launch
 *
 * @returns {Object} - Contains the browser reference created from playwright
 */
const newBrowserWS = async browserConf => {
  const type = getBrowserType(browserConf.type)
  const allStatus = await statusServer(type)
  const status = allStatus[type]

  if(!status.pid){
    Logger.log(`- Browser server not found. Starting new server...`)
    await startServer({...browserConf, type})
  }

  const { endpoint } = await getMetadata(type)

  // Check if the websocket is active
  // If so, then update the endpoint url to target the host machine
  const browserEndpoint = inDocker() && checkVncEnv().socketActive
    ? endpoint.replace('127.0.0.1', 'host.docker.internal')
    : endpoint

  const browser = await playwright[type].connect({ wsEndpoint: browserEndpoint })

  setBrowser(browser, type)
  return { browser }
}

/**
 * Starts new browser using the Playwright API
 * @function
 * @private
 * @param {string} type - Name of the browser to launch
 * @param {Array} args - Arguments to pass to the browser on launch
 * @param {Object} config - Options to pass to the browser on launch
 *
 * @returns {Object} - Contains the browser reference created from playwright
 */
const newBrowser = async (browserConf=noOpObj) => {

  // If the websocket is active, then start a websocket browser
  if(checkVncEnv().socketActive)
    return await newBrowserWS(browserConf)

  const type = getBrowserType(browserConf.type)

  const pwBrowser = getBrowser(type)
  if(pwBrowser){
    Logger.log(`- Found already running Browser`)
    return { browser: pwBrowser }
  }

  Logger.log(`- Starting Browser ${type}...`)
  const browser = await playwright[type].launch(getBrowserOpts(browserConf))
  setBrowser(browser, type)

  return { browser }
}

module.exports = {
  newBrowser,
  newBrowserWS,
}