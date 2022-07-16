const { getApp } = require('@GSH/App')
const { get, noOpObj } = require('@keg-hub/jsutils')

/**
 * Builds a browser config merging the passed in params and global config.browser settings
 * @param {Object} options - Options for interfacing with Playwright Browser object
 * @param {Object} [app] - Express Server Application
 *
 * @return {Object} - Browser config object
 */
const joinBrowserConf = (options=noOpObj, app) => {
  app = app || getApp()

  return {
    ...get(app, 'locals.config.browser', noOpObj),
    ...get(app, 'locals.config.screencast.browser', noOpObj),
    ...options,
  }
}

module.exports = {
  joinBrowserConf
}