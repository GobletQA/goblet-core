const cookieSession = require('cookie-session')
const { exists } = require('@keg-hub/jsutils')

/**
 * Sets up a cookie that will be stored client side
 * Will automatically expire at the end of a session or in 12hrs
 */
const setupCookie = app => {
  config = app.locals.config.server
  const {
    key,
    name,
    maxAge,
    secure,
    expires,
    sameSite,
    httpOnly,
    overwrite,
    secret=key,
} = config.cookie

  const cookieConf = {
    name,
    maxAge,
    httpOnly,
    overwrite,
    // If not in a deploy env then
    // We need the set a strict same site value, and non-secure
    // This allow setting the cookie in a dev env without https
    // If https is ever setup, then this could be removed
    // sameSite: isDeployedEnv ? 'None' : 'Strict',
    sameSite,
    ...(exists(maxAge) && {maxAge}),
    ...(exists(secure) && {secure}),
    ...(exists(secret) && {secret}),
    ...(exists(key) && {keys: [key]}),
    ...(exists(expires) && {expires}),
  }

  /**
   * Sets up a cookie that will be stored client side
   * Will automatically expire at the end of a session or in 12hrs
   */
  app.locals.config.server.auth &&
    app.use(cookieSession(cookieConf))
}

module.exports = {
  setupCookie,
}
