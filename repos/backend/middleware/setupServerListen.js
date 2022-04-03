const fs = require('fs')
const http = require('http')
const https = require('https')
const { getApp } = require('HerkinSharedApp')
const { Logger } = require('@keg-hub/cli-utils')


/**
 * Sets up a secure server, typically used for local development
 * @param {Object} app - Express app object
 *
 * @retruns {Object} - Insecure / Secure server object and Express app object
 */
const secure = (app) => {
  const { port, host } = app.locals.config.server
  const creds = {
    key: process.env.KEG_PROXY_PRIVATE_KEY,
    cert: process.env.KEG_PROXY_CERT,
    ca: process.env.KEG_PROXY_CA,
  }

  const credentials = Object.entries(creds).reduce((conf, [key, loc]) => {
    conf[key] = fs.readFileSync(loc, 'utf8')

    return conf
  }, {})

  const httpServer = http.createServer(app)
  const httpsServer = https.createServer(credentials, app)

  const insecureServer = httpServer.listen(port, () => {
    Logger.empty()
    Logger.pair(`[Tap-Proxy] Insecure Server running on: `, `http://${host}:${port}`)
    Logger.empty()
  })


  const secureServer = httpsServer.listen(443, () => {
    Logger.empty()
    Logger.pair(`[Tap-Proxy] Secure Server running on: `, `http://${host}:443`)
    Logger.empty()
  })

  return { insecureServer, secureServer, app }
}


/**
 * Sets up a server based on config settins
 *
 * @retruns {Object} - Response from server setup method
 */
const setupServerListen = () => {
  const app = getApp()
  return secure(app)
}

module.exports = {
  setupServerListen
}