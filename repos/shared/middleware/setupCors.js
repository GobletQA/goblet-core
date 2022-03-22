const { eitherArr } = require('@keg-hub/jsutils')
const { isDeployedEnv } = require('../utils/isDeployedEnv')

/**
 * Resolves the origin from the passed in headers
 * @param {Object} req - Express request object
 */
const getOrigin = req => {
  return (
    req.headers.origin ||
    (req.headers.referer && new URL(req.headers.referer).origin) ||
    (req.headers.host &&
      req.protocol &&
      `${req.protocol}://${req.headers.host.split(':').shift()}`)
  )
}

/**
 * Configures cors for the backend API and websocket
 * Defines the origins that are allow to connect to the API
 * @param {Object} app - Express app object
 *
 * @returns {void}
 */
const setupCors = app => {
  if (!app) return

  const config = app.locals.config.server
  const allowedOrigins = !config.origins
    ? ['*']
    : eitherArr(config.origins, [config.origins])

  app.use((req, res, next) => {
    const origin = getOrigin(req)

    // If in a deployed env, then validate the origin
    // Otherwise allow the origin in development envs
    const foundOrigin = isDeployedEnv
      ? allowedOrigins.includes(origin)
        ? origin
        : allowedOrigins[0]
      : origin

    res.setHeader('Access-Control-Allow-Origin', foundOrigin)
    res.setHeader('Vary', 'Origin,Access-Control-Request-Headers')
    res.setHeader('Access-Control-Allow-Credentials', 'true')
    res.setHeader(
      'Access-Control-Allow-Methods',
      'GET,POST,PUT,PATCH,DELETE,HEAD,OPTIONS'
    )
    res.setHeader(
      'Access-Control-Allow-Headers',
      'X-PINGOTHER,Origin,X-Requested-With,Content-Type,Accept,Authorization,AuthToken'
    )

    return req.method === 'OPTIONS' ? res.status(200).send('OK') : next()
  })
}

module.exports = {
  setupCors,
}
