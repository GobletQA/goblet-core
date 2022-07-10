#!/usr/bin/env node
require('../../../configs/aliases.config').registerAliases()

const { getApp } = require('GobletSharedApp')
const { validateUser } = require('./middleware')
const { Logger } = require('@keg-hub/cli-utils')
const apiEndpoints = require('GobletSCEndpoints')
const {
  setupCors,
  setupServer,
  setupLoggerReq,
  setupLoggerErr,
} = require('GobletSharedMiddleware')

/**
 * Starts a express API server for screencast
 * Loads the Goblet Config, which is used for configuring the server
 *
 * @returns {Object} - Express app, server and socket.io socket
 */
const initApi = async () => {
  const app = getApp()

  const { screencast } = app.locals.config
  const { server: serverConf } = screencast

  setupLoggerReq(app)
  setupCors(app)
  setupServer(app)
  validateUser(app)
  apiEndpoints(app)
  setupLoggerErr(app)

  const server = app.listen(serverConf.port, serverConf.host, () => {
    const serverUrl = `http://${serverConf.host}:${serverConf.port}`

    Logger.empty()
    Logger.pair(`Goblet Screencast API listening on`, serverUrl)
    Logger.empty()
  })

  return { app, server }
}



require.main === module
  ? initApi()
  : (module.exports = () => {
      initApi()
    })
