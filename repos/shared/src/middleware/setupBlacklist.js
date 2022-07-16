const fs = require('fs')
const path = require('path')
const { noOp } = require('@keg-hub/jsutils')
const { getApp } = require('@GSH/App')
const blacklist = require('express-blacklist')
const expressDefend = require('express-defend')
const { aliases } = require('@GConfigs/aliases.config')

/**
 * Overwrite the default to allow passing a callback to fs.appendFile
 * Which fixes an error in the express-defend repo
 */
expressDefend.fileAppender = (logFile, message) => fs.appendFile(logFile, message, noOp)

/** Path to the logs directory */
const logDir = aliases[`@GLogs`]

/** Ensure the logs directory exists */
!fs.existsSync(logDir) && fs.mkdirSync(logDir)

/**
 * Sets up IP blocking via a blacklist
 * Attempts to track suspicious activity and then block that IP from access
 */
const setupBlacklist = (app) => {
  app = app || getApp()

  app.use(blacklist.blockRequests(path.join(logDir, `blacklist.txt`)))

  app.use(expressDefend.protect({
    maxAttempts: 5,
    dropSuspiciousRequest: true,
    logFile: path.join(logDir, `suspicious.log`),
    onMaxAttemptsReached: (ipAddress, url) => {
      console.log(`Adding IP Address to blacklist:`, ipAddress)
      blacklist.addAddress(ipAddress)
    }
  }))

}

module.exports = {
  setupBlacklist
}