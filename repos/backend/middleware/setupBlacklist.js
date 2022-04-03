const path = require('path')
const fs = require('fs')
const { getApp } = require('HerkinSharedApp')
const blacklist = require('express-blacklist')
const expressDefend = require('express-defend')

/**
 * Path to the logs directory
 */
const logDir = path.join(__dirname, `../../../logs`)
// Ensure the logs directory exists
!fs.existsSync(logDir) && fs.mkdirSync(logDir)

/**
 * Sets up IP blocking via a blacklist
 * Attempts to track suspicious activity and then block that IP from access
 */
const setupBlacklist = () => {
  const app = getApp()

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