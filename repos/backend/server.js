#!/usr/bin/env node
const { initSockr } = require('./libs/sockr')
const { getApp } = require('HerkinSharedApp')
const { Logger } = require('@keg-hub/cli-utils')
const apiEndpoints = require('HerkinBackEndpoints')
const { isDeployedEnv } = require('HerkinSharedUtils/isDeployedEnv')
const {
  setReqRepo,
  setupVNCProxy,
  validateUser,
} = require('HerkinBackMiddleware')
const {
  setupCors,
  setupCookie,
  setupLogger,
  setupServer,
  setupStatic,
} = require('HerkinSharedMiddleware')

/**
 * Starts a express API server, and connects the sockr Websocket
 * Loads the HerkinConfig, which is used for configuring the server
 *
 * @returns {Object} - Express app, server and socket.io socket
 */
const initApi = async () => {
  const app = getApp()
  const { server: serverConf, sockr: sockrConf } = app.locals.config

  setupCors(app)
  setupCookie(app)
  setupLogger(app)
  setupServer(app)
  setupStatic(app)
  validateUser(app)
  setReqRepo(app)
  apiEndpoints(app)
  const wsProxy = setupVNCProxy(app)

  const server = app.listen(serverConf.port, serverConf.host, () => {
    Logger.empty()
    Logger.pair(
      `Herkin Backend API listening on`,
      `http://${serverConf.host}:${serverConf.port}`
    )
    Logger.empty()
  })

  server.on('upgrade', wsProxy.upgrade)
  const socket = await initSockr(app, server, sockrConf, 'tests')

  return { app, server, socket }
}

/**
 * Ensure nodemon restarts properly
 * Sometimes nodemon tries to restart faster then the process can shutdown
 * This should force kill the process when it receives the SIGUSR2 event from nodemon
 * Taken from https://github.com/standard-things/esm/issues/676#issuecomment-766338189
 */
!isDeployedEnv &&
  process.once('SIGUSR2', () => process.kill(process.pid, 'SIGUSR2'))

module.exports = {
  initApi,
}
