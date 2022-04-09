// TODO: @lance-tipton - figure out how to decouple this from
const { get, noOpObj } = require('@keg-hub/jsutils')
const { actionBrowser, doRecordAction } = require('HerkinSCPlaywright')

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
    const { token, ref, action, ...browser } = data

    const recorder = await doRecordAction({
      action,
      id: socket.id,
      browserConf: joinConf(browser, app),
      onRecordEvent:(event) => {
        // console.log(event)
        // Manager.emitAll(`browserRecorder`, { data: event })
        // TODO: @lance-tipton - emit socket event to FE
        console.log(`------- emit event ${event.name} -------`)
        Manager.emit(socket, `browserRecorder`, { ...event, group: socket.id })
      }
    })

    Manager.cache[socket.id] = { id: socket.id,  recorder }
  }
}

module.exports = {
  browserRecorder,
}
