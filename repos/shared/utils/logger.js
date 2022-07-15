const { getApp } = require('@GSH/App')
const { Logger } = require(`@keg-hub/cli-utils`)
const { get, isNum } = require(`@keg-hub/jsutils`)

/**
 * Log Levels by name and priority
 * @type {Object}
 */
const logLevelMap = Object.entries({
  none: 0,
  info: 1,
  debug: 2,
  warn: 3,
  error: 4,
}).reduce((acc, [name, priority]) => {
  acc[name] = priority
  acc[priority] = name

  return acc
}, {})

/**
 * Gets the log level defined in the express app config
 *
 * @returns {number} - Log level based on value set in the app config
 */
const getLogLevel = () => {
  const app = getApp()
  const logType = get(app.locals, 'config.server.logLevel')
  return isNum(logType) ? logType : logLevelMap[logType]
}

/**
 * Logs the massed in messages based on the app configs log level
 * If the apps logLevel is equal or less then the checkLevel, the message will be logged
 * @function
 * @param {number} checkLevel - Log level of the message
 * @param {Array<*>} messages - The items that should be logged
 *
 * @return {void}
 */
const logger = (checkLevel, ...messages) => {
  const logLevel = getLogLevel()

  logLevel && logLevel <= checkLevel && Logger.log(...messages)
}

module.exports = {
  getLogLevel,
  logLevelMap,
  logger,
}
