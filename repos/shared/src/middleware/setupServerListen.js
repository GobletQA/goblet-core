const fs = require('fs')
const http = require('http')
const https = require('https')
const { getApp } = require('@GSH/App')
const { Logger } = require('@keg-hub/cli-utils')

/**
 * Adds exit listeners to allow graceful shutdown of the servers
 * @exits
 * @param {Object} insecureServer - Express server object
 * @param {Object} secureServer - Express server object
 *
 */
const exitListener = (insecureServer, secureServer) => {
  let exitCalled
  ;([
    `SIGINT`,
    `SIGTERM`,
    `SIGUSR1`,
    `SIGUSR2`,
    `uncaughtException`,
  ]).map(type => {
    
    process.on(type, () => {
      if(exitCalled) return

      const exitCode = type === `uncaughtException` ? 1 : 0
      let secureClosed
      let insecureClosed

      exitCalled = true
      Logger.info(`[Goblet] Server cleaning up...`)
      secureServer &&
        secureServer.close(() => {
          secureClosed = true
          Logger.success(`[Goblet] Finished cleaning up secure server!`)
          ;(!insecureServer || insecureClosed) && process.exit(exitCode)
        })

      insecureServer &&
        insecureServer.close(() => {
          insecureClosed = true
          Logger.success(`[Goblet] Finished cleaning up insecure server!`)
          ;(!secureServer || secureClosed) && process.exit(exitCode)
        })
      
      !secureServer && !insecureServer && process.exit(exitCode)
    })
  })
}

/**
 * Sets up a secure server, typically used for local development
 * @param {Object} app - Express app object
 * @param {Object} serverConf - Configuration for the server
 *
 * @returns {Object} - Insecure / Secure server object and Express app object
 */
const serverListen = (app, serverConf, exitListen=true) => {
  const { securePort, port, host, name } = serverConf
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

  const serverTag = `[Goblet ${name || 'Server'}]`
  const insecureServer = httpServer.listen(port, () => {
    Logger.empty()
    Logger.pair(`${serverTag} Insecure Server running on: `, `http://${host}:${port}`)
    Logger.empty()
  })

  const secureServer = httpsServer &&
    httpsServer.listen(securePort, () => {
      Logger.empty()
      Logger.pair(`${serverTag} Secure Server running on: `, `https://${host}:443`)
      Logger.empty()
    })

  exitListen && exitListener(insecureServer, secureServer)

  return { insecureServer, secureServer, app }
}


/**
 * Sets up a server based on config settins
 *
 * @retruns {Object} - Response from server setup method
 */
const setupServerListen = (app, config) => {
  return serverListen(app || getApp(), config)
}

module.exports = {
  setupServerListen
}