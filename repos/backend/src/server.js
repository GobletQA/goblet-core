#!/usr/bin/env node
const { getApp } = require('@GSH/App')
const apiEndpoints = require('@GBK/Endpoints')
const { initSockr } = require('@GBK/Sockr/sockr')
const { isDeployedEnv } = require('@GSH/Utils/isDeployedEnv')
const {
  setReqRepo,
  setupVNCProxy,
  validateUser,
  setupBlacklist,
  setupServerListen,
} = require('@GBK/Middleware')
const {
  setupJWT,
  setupCors,
  setupServer,
  setupStatic,
  setupLoggerReq,
  setupLoggerErr,
} = require('@GSH/Middleware')

/**
 * Starts a express API server, and connects the sockr Websocket
 * Loads the Goblet Config, which is used for configuring the server
 *
 * @returns {Object} - Express app, server and socket.io socket
 */
const initApi = async () => {
  const app = getApp()
  const { server: serverConf, sockr: sockrConf } = app.locals.config

  setupLoggerReq(app)
  setupBlacklist(app)
  setupCors(app)
  setupJWT(app, ['/auth/validate'])
  setupServer(app)
  setupStatic(app)
  validateUser(app)
  setReqRepo(app)
  apiEndpoints(app)
  setupLoggerErr(app)

  const wsProxy = setupVNCProxy(app)
  const { insecureServer, secureServer } = setupServerListen(app)

  const server = secureServer || insecureServer

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