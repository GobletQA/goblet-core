import http from 'http'
import https from 'https'
import { TServerConfig } from '../types'
import { getApp } from '@gobletqa/shared/app'
import { Express } from 'express'
import { DEF_HOST_IP } from '../constants/constants'

import { setupRouters } from '@gobletqa/conductor/middleware/setupRouters'
import { setupAuthUser } from '@gobletqa/conductor/middleware/setupAuthUser'
import {
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
  setupAuthUser(app)
  setupServer(app, false, false)
  setupRouters(app)
  

  const { insecureServer, secureServer } = setupServerListen(app, serverConf)
  setupLoggerErr(app)

  const server = (secureServer as https.Server) || (insecureServer as http.Server)

  return {
    app,
    server,
    secureServer,
    insecureServer
  }

} 