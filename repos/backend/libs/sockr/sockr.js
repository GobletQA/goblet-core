const {  browserStatus, ...customEvents} = require('./events')
const { noOpObj } = require('@keg-hub/jsutils')
const { sockr, Manager } = require('@ltipton/sockr/src/server')

const initSockr = (app, server, config=noOpObj, cmdType) => {
  return sockr(server, {
    ...config,
    events: {
      ...config.events,
      ...customEvents,
      browserStatus: browserStatus(app),
    }
  }, cmdType)
}

module.exports = {
  initSockr
}