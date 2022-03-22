const cookieSession = require('cookie-session')
const { isDeployedEnv } = require('../utils/isDeployedEnv')

/**
 * Sets up a cookie that will be stored client side
 * Will automatically expire at the end of a session or in 12hrs
 */
const setupCookie = app => {
  config = app.locals.config.server
  const {
    name=`keg-herkin`,
    key=`keg-herkin-cookie-7979`,
    secret=key,
} = config.cookie

  const cookieConf = {
    httpOnly: true,
    overwrite: true,
    maxAge: 12 * 60 * 60 * 1000,
    // Set expire date to tomorrow
    expires: new Date(new Date().getTime() + 86400000),
    keys: [key],
    name: name,
    secret: secret,
    // If not in a deploy env then
    // We need the set a strict same site value, and non-secure
    // This allow setting the cookie in a dev env without https
    // If https is ever setup, then this could be removed
    sameSite: isDeployedEnv ? 'None' : 'Strict',
    // Only set to secure if in a deployed env
    secure: isDeployedEnv,
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
