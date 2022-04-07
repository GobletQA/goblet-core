// TODO: @lance-tipton - figure out how to decouple this from
const { get, noOpObj } = require('@keg-hub/jsutils')
const { actionBrowser } = require('HerkinSCPlaywright')

/**
 * Builds a browser config merging the passed in params and global config.browser settings
 * @param {Object} options - Options for interfacing with Playwright Browser object
 * @param {Object} app - Express Server Application
 *
 * @return {Object} - Browser config object
 */
const joinConf = (options, app) => {
  return {
    ...get(app, 'locals.config.browser', noOpObj),
    ...get(app, 'locals.config.screencast.browser', noOpObj),
    ...options,
  }
}

const browserRecorder = app => {
  return async ({ data, socket, config, Manager, io }) => {
    // TODO: add token validation
    const { token, ref, actions, ...browser } = data

    const responses = await actionBrowser({
      ref,
      actions,
      id: socket.id,
      onRecordEvent: (event) => {
        // TODO: @lance-tipton - emit socket event to FE
        console.log(`------- event -------`)
        console.log(event)
      },
    }, joinConf(browser, app))

  }
}

module.exports = {
  browserRecorder,
}
