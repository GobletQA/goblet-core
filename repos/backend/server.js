#!/usr/bin/env node
const { getApp } = require('HerkinSharedApp')
const { initSockr } = require('./libs/sockr')
const apiEndpoints = require('HerkinBackEndpoints')
const { Logger } = require('@keg-hub/cli-utils')
const {
  setupCors,
  setupLogger,
  setupServer,
  setupStatic,
  setupVNCProxy,
} = require('HerkinSharedMiddleware')

/**
 * Starts a express API server, and connects the sockr Websocket
 * Loads the HerkinConfig, which is used for configuring the server
 *
 * @returns {Object} - Express app, server and socket.io socket
 */
const initApi = async () => {
  const app = getApp()
  const {
    server:serverConf,
    sockr:sockrConf,
  } = app.locals.config

  setupLogger(app)
  setupCors(app)
  setupServer(app)
  setupStatic(app)
  apiEndpoints(app)
  const wsProxy = setupVNCProxy(app)

  const server = app.listen(
    serverConf.port,
    serverConf.host,
    () => {
      const serverUrl = `http://${serverConf.host}:${serverConf.port}`

      Logger.empty()
      Logger.pair(`Herkin Backend API listening on`, serverUrl)
      Logger.empty()
    }
  )

  server.on('upgrade', wsProxy.upgrade)
  const socket = await initSockr(app, server, sockrConf, 'tests')

  return { app, server, socket }
}

module.exports = {
  initApi
}
