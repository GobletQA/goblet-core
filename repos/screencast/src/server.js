#!/usr/bin/env node
require('../../../configs/aliases.config').registerAliases()

const { getApp } = require('HerkinSharedApp')
const apiEndpoints = require('HerkinSCEndpoints')
const { Logger } = require('@keg-hub/cli-utils')
const {
  setupCors,
  setupLogger,
  setupServer,
} = require('HerkinSharedMiddleware')

/**
 * Starts a express API server for screencast
 * Loads the HerkinConfig, which is used for configuring the server
 *
 * @returns {Object} - Express app, server and socket.io socket
 */
const initApi = async () => {
  const app = getApp('screencast')
  const { server: serverConf } = app.locals.config

  setupLogger(app)
  setupCors(app)
  setupServer(app)
  apiEndpoints(app)

  const server = app.listen(serverConf.port, serverConf.host, () => {
    const serverUrl = `http://${serverConf.host}:${serverConf.port}`

    Logger.empty()
    Logger.pair(`Herkin Screencast API listening on`, serverUrl)
    Logger.empty()
  })

  return { app, server }
}

!module.parent && module.id !== '.'
  ? initApi()
  : (module.exports = () => {
      initApi()
    })
