import http from 'http'
import https from 'https'
import { getApp } from '@GSH/App'
import { Express } from 'express'
import { TServerConfig } from '../conductor.types'
import { DEF_HOST_IP } from '../constants/constants'
import {
  setupJWT,
  setupCors,
  setupServer,
  setupLoggerReq,
  setupLoggerErr,
  setupServerListen,
} from '@GSH/Middleware'


export const createServer = (config:TServerConfig) => {
  const serverConf = {name: `Conductor`, host: DEF_HOST_IP, ...config}

  const app = getApp() as Express
  setupLoggerReq(app)
  setupCors(app)
  // Investigate setting up JWT for proxies
  // setupJWT(app)
  setupServer(app)

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