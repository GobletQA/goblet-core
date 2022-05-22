const { noOpObj } = require('@keg-hub/jsutils')
const { validateToken }  = require('./validateToken')
const { sockr } = require('@ltipton/sockr/src/server')
const {
  authToken,
  repoStatus,
  connection,
  disconnect,
  browserStatus,
  browserRunTests,
  browserRecorder,
  ...customEvents
} = require('./events')

/**
 * Init sockr passing in the custom event listeners
 */
const initSockr = (app, server, config = noOpObj, cmdType) => {
  return sockr(
    server,
    {
      ...config,
      events: {
        ...config.events,
        ...customEvents,
        authToken: authToken(app),
        disconnect: disconnect(app),
        connection: connection(app),
        repoStatus: validateToken(app, repoStatus(app)),
        browserStatus: validateToken(app, browserStatus(app)),
        browserRunTests: validateToken(app, browserRunTests(app)),
        browserRecorder: validateToken(app, browserRecorder(app)),
      },
    },
    cmdType
  )
}

module.exports = {
  initSockr,
}
