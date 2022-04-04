const { AppRouter } = require('HerkinSharedRouter')
const { asyncWrap, resError } = require('HerkinSharedExp')

/**
 * Checks if the user and their token exists in the session.
 * If not, then throws an error
 */
const checkUserInSession = asyncWrap(async (req, res, next) => {
  if (req.user && req.user.userId && req.user.token) return next()

  resError(`User session is expired, please sign in`, 401)
})

/**
 * Checks if server auth is enabled
 * Then adds middleware to validation a users session
 */
const validateUser = app => {
  app.locals.config.server.auth && AppRouter.use(`/repo\/*`, checkUserInSession)
}

module.exports = {
  validateUser,
}
