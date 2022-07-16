const { Logger } = require('@keg-hub/cli-utils')
const { get, noOpObj } = require('@keg-hub/jsutils')
const { statusBrowser } = require('@GSC/Playwright/browser/statusBrowser')

let watchInterval = false
let prevStatus

/**
 * Calls the statusBrowser to get the status of the browser
 * @function
 * @param {Object} browserConf - Config options for checking the browser status
 * @param {Object} Manager - Sockr Manager Instance
 *
 * @returns {void}
 */
const getStatusUpdate = async (browserConf, Mgr) => {
  const status = await statusBrowser(browserConf)
  // If no status chance, don't update the backend
  if (prevStatus === status.status) return

  prevStatus = status.status
  Mgr.emitAll(`browserStatus`, { data: status })
}

/**
 * Uses setInterval to loop call the status update method
 * Interval method runs every 5 seconds unless overridden by passed in options
 * @function
 * @param {Object} app - Express App object
 * @param {Object} options - Options for watching the browser
 * @param {Object} Manager - Sockr Manager Instance
 *
 * @returns {function} - setInterval response for clearing the interval
 */
const startWatching = (app, options, Manager) => {
  const browserConf = get(app, 'locals.config.screencast.browser', noOpObj)

  return setInterval(
    async (bConf, Mgr) => {
      return await getStatusUpdate(bConf, Mgr).catch(err =>
        Logger.error(err.message)
      )
    },
    options.interval || 5000,
    { ...browserConf, ...options },
    Manager
  )
}

/**
 * Helper to watch the Playwright browser status
 * Checks if it should start watching the browser, and calls the watching if needed
 * Allows passing a `stopWatching` to stop the loop check
 * @function
 * @param {Object} app - Express App object
 *
 * @returns {function} - Custom Event Method passed to Sockr to be called from the frontend
 */
const browserStatus = app => {
  return ({ message = noOpObj, socket, config, Manager, io }) => {
    if (message.stopWatching) {
      watchInterval && clearInterval(watchInterval)
      return (watchInterval = false)
    }

    watchInterval = startWatching(app, message, Manager)
  }
}

module.exports = {
  browserStatus,
}
