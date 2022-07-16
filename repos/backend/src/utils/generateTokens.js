const jwt = require('jsonwebtoken')

/**
 * Validates the required authentication information exists
 */
 
/**
 * Validates the required authentication information exists
 * @param {Object} config - JWT config defined in the server.config.js file
 * @param {Object} data - User data to store in the token
 *
 * @returns {Object} - Returns new JWT tokens
 */
const generateTokens = (config, data) => {
  const {
    exp,
    secret,
    algorithms,
    refreshExp,
    refreshSecret
  } = config

  // Don't include the token in the refresh data
  // Tokens are longer lived and more likely to get hacked
  const { token, ...refreshData } = data

  return {
    // Add the user data to the jwt token and refresh token
    jwt: jwt.sign(data, secret, { algorithm: algorithms[0], expiresIn: exp }),
    refresh: jwt.sign(refreshData, refreshSecret, { algorithm: algorithms[0], expiresIn: refreshExp }),
  }
}

module.exports = {
  generateTokens,
}
