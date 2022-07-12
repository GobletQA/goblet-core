const playwright = require('playwright')
const { noOpObj } = require('@keg-hub/jsutils')
const { getMetadata } = require('../server/server')
const { getBrowser, setBrowser } = require('./browser')
const { statusServer, startServer } = require('../server')
const { Logger, inDocker } = require('@keg-hub/cli-utils')
const { checkVncEnv } = require('../../utils/vncActiveEnv')
const { getBrowserOpts } = require('../helpers/getBrowserOpts')
const { getBrowserType } = require('../helpers/getBrowserType')

/**
 * Checks for the pid of an already running browser
 * @param {string} type - Name of the browser to check
 * @param {boolean} checkStatus - Should the browser status be checked
 *
 * @returns {number|boolean} - PID if found, true if checkStatus === false, or false if no PID
 */
const getBrowserPid = async (type, checkStatus) => {
  // If no status check, return true which is the same as having a pid for the browser
  if (!checkStatus) return true

  const allStatus = await statusServer(type)
  const status = allStatus && allStatus[type]

  return status & status.pid
}

/**
 * Starts new browser by connecting to an existing browser server websocket
 * @function
 * @private
 * @param {string} browserConf.browserType - Name of the browser to launch
 * @param {Array} browserConf.args - Arguments to pass to the browser on launch
 * @param {Object} browserConf.config - Options to pass to the browser on launch
 * @param {boolean} [checkStatus=true] - Should the browser status be checked
 *
 * @returns {Object} - Contains the browser reference created from playwright
 */
const newBrowserWS = async (browserConf, checkStatus = true) => {
  const type = getBrowserType(browserConf.type)
  const statusPid = await getBrowserPid(type, checkStatus)

  if (!statusPid) {
    Logger.log(`- Browser server not found. Starting new server...`)
    await startServer({ ...browserConf, type })
  }

  const { endpoint } = await getMetadata(type)

  // Check if the websocket is active
  // If so, then update the endpoint url to target the host machine
  const browserEndpoint =
    inDocker() && checkVncEnv().socketActive
      ? endpoint.replace('127.0.0.1', 'host.docker.internal')
      : endpoint

  const browser = await playwright[type].connect({
    wsEndpoint: browserEndpoint,
  })

  setBrowser(browser, type)
  return { browser }
}

/**
 * Starts new browser using the Playwright API
 * @function
 * @private
 * @param {string} browserConf.type - Name of the browser to launch
 * @param {Array} browserConf.args - Arguments to pass to the browser on launch
 * @param {Object} browserConf.config - Options to pass to the browser on launch
 * @param {boolean} checkStatus - Should the browser status be checked
 *
 * @returns {Object} - Contains the browser reference created from playwright
 */
const newBrowser = async (browserConf = noOpObj, checkStatus) => {
  try {
    // If the websocket is active, then start a websocket browser
    if (checkVncEnv().socketActive)
      return await newBrowserWS(browserConf, checkStatus)

    const type = getBrowserType(browserConf.type)

    const pwBrowser = getBrowser(type)
    if (pwBrowser) {
      Logger.stdout(`- Found already running Browser\n`)
      return { browser: pwBrowser }
    }

    // Hack due to multiple calls on frontend startup
    // If more then one calls, and the browser is not create
    // then it will create two browsers
    // So this re-calls the same method when creatingBrowser is set
    // To allow consecutive calls on start up
    if(newBrowser.creatingBrowser)
      return new Promise((res, rej) => {
        setTimeout(() => res(newBrowser(browserConf, checkStatus)), 500)
      })

    newBrowser.creatingBrowser = true

    Logger.stdout(`- Starting Browser ${type}...\n`)
    const browser = await playwright[type].launch(getBrowserOpts(browserConf))
    setBrowser(browser, type)

    newBrowser.creatingBrowser = false

    return { browser }
  }
  catch(err){
    // Ensure creatingBrowser gets set to false
    newBrowser.creatingBrowser = false
    throw err
  }
}

module.exports = {
  newBrowser,
  newBrowserWS,
}
