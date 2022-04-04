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
const serverListen = (app) => {
  const { securePort, port, host } = app.locals.config.server
  const creds = {
    key: process.env.KEG_PROXY_PRIVATE_KEY,
    cert: process.env.KEG_PROXY_CERT,
    ca: process.env.KEG_PROXY_CA,
  }

  const credentials = Object.entries(creds).reduce((conf, [key, loc]) => {
    fs.existsSync(loc) && (conf[key] = fs.readFileSync(loc, 'utf8'))

    return conf
  }, {})

  const httpServer = http.createServer(app)
  const httpsServer = credentials.cert &&
    credentials.key &&
    https.createServer(credentials, app)

  const insecureServer = httpServer.listen(port, () => {
    Logger.empty()
    Logger.pair(`[Tap-Proxy] Insecure Server running on: `, `http://${host}:${port}`)
    Logger.empty()
  })

  const secureServer = httpsServer &&
    httpsServer.listen(securePort, () => {
      Logger.empty()
      Logger.pair(`[Tap-Proxy] Secure Server running on: `, `https://${host}:443`)
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
  return serverListen(app)
}

module.exports = {
  setupServerListen
}