const { noOpObj } = require('@keg-hub/jsutils')
const { sockr } = require('@ltipton/sockr/src/server')
const {
  authToken,
  browserStatus,
  repoStatus,
  connection,
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
        connection: connection(app),
        browserStatus: browserStatus(app),
        repoStatus: repoStatus(app),
      },
    },
    cmdType
  )
}

module.exports = {
  initSockr,
}
