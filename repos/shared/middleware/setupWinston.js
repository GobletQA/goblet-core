const { config } = require('winston')
const { noOpObj } = require('@keg-hub/jsutils')
const expressWinston = require('express-winston')
const { buildLogger } = require('../utils/buildLogger')

const requestMiddleware = (loggerOpts=noOpObj, middlewareOpts) => {
  const logger = buildLogger(loggerOpts)
  const appLogLevel = config.npm.levels[loggerOpts.level || 'info']

  const requestLogger = expressWinston.logger({
    winstonInstance: logger,
    colorize: false,
    expressFormat: true,
    /** Only log the metadata, if the log level is set to at least verbose */
    meta: Boolean(appLogLevel >= config.npm.levels.verbose),
    /** override options above with passed in options */
    ...middlewareOpts,
  })

  return requestLogger
}

const errorMiddleware = (loggerOpts=noOpObj, middlewareOpts) => {
  const logger = buildLogger(loggerOpts)
  const appLogLevel = config.npm.levels[loggerOpts.level]

  const errorLogger = expressWinston.errorLogger({
    winstonInstance: logger,
    /** Only log the metadata, if the log level is set to at least verbose */
    meta: Boolean(appLogLevel >= config.npm.levels.verbose),
    /** override options above with passed in options */
    ...middlewareOpts,
  })

  return errorLogger
}

module.exports = {
  errorMiddleware,
  requestMiddleware,
}
