const { asyncWrap, apiRes, resError } = require('@GSH/Exp')
const { validateRefreshToken } = require('@GBK/Utils/validateRefreshToken')

/**
 * Validates the required authentication information exists
 */
const refresh = asyncWrap(async (req, res) => {
  const { refreshToken } = req.body
  const config = req.app.locals.config.server

  const jwtTokens = validateRefreshToken(config.jwt, req.user, refreshToken)

  return jwtTokens
    ? apiRes(req, res, jwtTokens, 200)
    : resError(`User session is expired, please sign in`, 401)
})

module.exports = {
  refresh,
}
