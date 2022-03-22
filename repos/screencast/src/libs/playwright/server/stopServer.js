const metadata = require('../helpers/metadata')
const { Logger } = require('@keg-hub/cli-utils')
const { findProc, killProc } = require('../../proc')
const { setServer, getServer } = require('./server')
const { limbo, checkCall } = require('@keg-hub/jsutils')

/**
 * Stops the running browser server if it eixsts
 * @function
 * @public
 *
 * @returns {Void}
 */
const stopServer = async () => {
  // Wrap the close method incase something happens
  // We still want to reset the browser reference and meta data
  try {
    const pwServer = getServer()
    if (pwServer) {
      pwServer.pid && killProc(pwServer)
      pwServer.close && (await pwServer.close())
    } else {
      await checkCall(async () => {
        // Kill both chrome and firefox
        const [errChrome, statusChrome] = await limbo(findProc('chromium'))
        statusChrome && statusChrome.pid && killProc(statusChrome)

        const [errFF, statusFF] = await limbo(findProc('firefox'))
        statusFF && statusFF.pid && killProc(statusFF)

        const [errWK, statusWK] = await limbo(findProc('webkit'))
        statusWK && statusWK.pid && killProc(statusWK)
      })
    }
  } catch (err) {
    Logger.error(err.message)
  }

  await metadata.remove()
  setServer(undefined)
}

module.exports = {
  stopServer,
}
