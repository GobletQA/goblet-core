const { Logger } = require(`@keg-hub/cli-utils`)
const { AppRouter } = require('HerkinSharedRouter')
const { isObj, isArr, exists } = require(`@keg-hub/jsutils`)
const { getLogLevel, logger, logLevelMap } = require(`HerkinSharedUtils/logger`)

/**
 * Helper to get information from a request
 * @function
 * @param {Object} req - Express request object for the incoming request
 *
 * @return {void}
 */
const getReqInfo = req => {
  return {
    request: `${req.method} ${req.originalUrl}`,
    route: req?.route?.path,
    host: req.hostname,
    body: req.body,
    query: req.query,
    params: req.params,
  }
}

/**
 * Helper to get information to be logged for a response
 * @function
 * @param {Object} data - Json data of the response
 * @param {string|number} status - Status code of the response
 *
 * @return {void}
 */
const getResInfo = (data, status) => {
  const logLevel = getLogLevel()
  const showFull = logLevel > logLevelMap.debug

  return {
    status,
    data: showFull
      ? data
      : Object.entries(data).reduce((acc, [key, val]) => {
          acc[key] = isObj(val) ? `{...}` : isArr(val) ? `[...]` : val

          return acc
        }, {}),
  }
}

/**
 * Handler for logging the incoming request
 * @function
 * @param {Object} req - Express request object for the incoming request
 * @param {Object} res - Express response object sent back to the client
 * @param {function} next - Express next method to pass control to the next handler of the request
 *
 * @return {void}
 */
const logRequest = (req, res, next) => {
  // So req.params was always empty
  // because the params are not parsed until a matching route is found
  // Setting a timeout to run on the next event loop to ensure the params are available
  setTimeout(() => {
    logger(
      2,
      Logger.colors.brightCyan(`\n[Keg-Herkin Req]`),
      getReqInfo(req),
      `\n`
    )
  }, 0)
  // Don't delay the next call
  // This ensures the request doesn't stop being processed
  // Would probably be better to
  // somehow push logging onto another spawned process
  // Something else to investigate at some point
  next()
}

/**
 * Handler for logging the outgoing requests
 * Monkey patches the default res.json method with a custom method
 * @function
 * @param {Object} req - Express request object for the incoming request
 * @param {Object} res - Express response object sent back to the client
 * @param {function} next - Express next method to pass control to the next handler of the request
 *
 * @return {void}
 */
const logResponse = (req, res, next) => {
  const orgJson = res.json
  res.json = data => {
    logger(
      2,
      Logger.colors.brightCyan(`\n[Keg-Herkin Res]`),
      !exists(data) || data.error ? data : getResInfo(data, res.statusCode)
    )

    !res.headerSent && orgJson.apply(res, [data])
  }

  next()
}

/**
 * Adds middleware logging for requests
 * @function
 *
 * @return {void}
 */
const setupLoggerReq = () => {
  AppRouter.use(logRequest)
}

/**
 * Adds middleware logging for response
 * @function
 *
 * @return {void}
 */
const setupLoggerRes = () => {
  AppRouter.use(logResponse)
}

module.exports = {
  setupLoggerReq,
  setupLoggerRes
}
