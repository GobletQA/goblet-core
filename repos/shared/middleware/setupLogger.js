const { config } = require('winston')
const { noOpObj } = require('@keg-hub/jsutils')
const expressWinston = require('express-winston')
const { buildLogger } = require('../utils/buildLogger')

/**
 * Adds middleware logging for requests
 * @function
 *
 * @return {void}
 */
const setupLoggerReq = (app, middlewareOpts=noOpObj) => {
  const loggerOpts = app.locals.config.logger || noOpObj
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

/**
 * Adds middleware logging for errors
 * @function
 *
 * @return {void}
 */
const setupLoggerErr = (app, middlewareOpts=noOpObj) => {
  const loggerOpts = app.locals.config.logger || noOpObj
  const logger = buildLogger(loggerOpts)
  const appLogLevel = config.npm.levels[loggerOpts.level || 'info']

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
  setupLoggerReq,
  setupLoggerErr
}
