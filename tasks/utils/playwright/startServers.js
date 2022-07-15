const { limbo } = require('@keg-hub/jsutils')
const { startServer } = require('@GSC/Playwright/server/startServer')
const { statusServer } = require('@GSC/Playwright/server/statusServer')
const {
  ensureBrowserType,
} = require('@GTasks/utils/helpers/ensureBrowserType')

/**
 * Starts the browser servers is they are not already running
 * @param {Array<string>} browsers - The names of browser servers to start
 * @param {Object} browserOpts - Settings for how the browser should start
 *
 * @return {Promise<Array>} - Resolves to an array of browser server objects
 */
const startServers = async (browsers, browserOpts) => {
  const status = await statusServer()

  return Promise.all(
    browsers.map(async browser => {
      const type = ensureBrowserType(browser)
      const launchOpts = { ...browserOpts, type }

      const [err, server] = await limbo(startServer(launchOpts))
      if (!err) return server

      Logger.warn(`Could not start ${browser} browser server`)
      Logger.log(err.message)
    })
  )
}

module.exports = {
  startServers,
}
