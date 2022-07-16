const jwt = require('jsonwebtoken')
const { generateTokens } = require('./generateTokens')

/**
 * Validates the passed in refresh token, and if valid creates new JWT tokens
 * Ensures the refreshToken data matches the current tokens data
 * @param {Object} config - JWT config defined in the server.config.js file
 * @param {Object} user - User object parsed from the original JWT token
 * @param {string} refreshToken - Old refresh token used to validate against the user object
 *
 * @returns {Object|boolean} - Returns new JWT tokens or false it token is invalid
 */
const validateRefreshToken = (config, user, refreshToken) => {
  const { refreshSecret } = config

  try {
    const decoded = jwt.verify(refreshToken, refreshSecret)

    return decoded.userId === user.userId &&
      decoded.username === user.username &&
      decoded.provider === user.provider &&
      generateTokens(config, user)

  }
  catch(err){
    return false
  }
}

module.exports = {
  validateRefreshToken
}