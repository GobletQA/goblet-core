import http from 'http'
import https from 'https'
import { Express } from 'express'
import { TServerConfig } from '../types'
import { getApp } from '@gobletqa/shared/app'
import { DEF_HOST_IP } from '../constants/constants'
import { setupEndpoints } from '@GCD/Middleware/setupEndpoints'
import {
  setupJWT,
  setupCors,
  setupServer,
  setupLoggerReq,
  setupLoggerErr,
  setupServerListen,
} from '@gobletqa/shared/middleware'

export const createServer = (config:TServerConfig) => {
  const serverConf = {name: `Conductor`, host: DEF_HOST_IP, ...config}

  const app = getApp() as Express
  setupLoggerReq(app)
  setupCors(app)
  // TODO: Investigate setting up JWT for proxies
  // setupJWT(app)
  setupServer(app, false, false)
  setupEndpoints(app)

  const { insecureServer, secureServer } = setupServerListen(app, serverConf)
  setupLoggerErr(app)

  const server = (secureServer as https.Server) || (insecureServer as http.Server)
  // TODO: figure out how to make this work
  // server.on('upgrade', wsProxy.upgrade)
  return {
    app,
    server,
    secureServer,
    insecureServer
  }

} 