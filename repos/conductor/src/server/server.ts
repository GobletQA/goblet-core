import http from 'http'
import https from 'https'
import { Express } from 'express'
import { TServerConfig } from '../types'
import { getApp } from '@gobletqa/shared/app'
import { DEF_HOST_IP } from '../constants/constants'

import { setupRouters } from '@gobletqa/conductor/middleware/setupRouters'
import { setupAuthUser } from '@gobletqa/conductor/middleware/setupAuthUser'
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
  setupAuthUser(app)
  setupServer(app, false, false)
  setupRouters(app)

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