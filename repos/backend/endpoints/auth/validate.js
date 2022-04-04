const jwt = require('jsonwebtoken')
const { Repo } = require('HerkinBackLibs/repo')
const { asyncWrap, apiRes } = require('HerkinSharedExp')

/**
 * Validates the required authentication information exists
 */
const validate = asyncWrap(async (req, res) => {
  const { id, username, token, provider } = req.body

  if (!id || !username || !token || !provider)
    throw new Error(`Provider metadata is unknown. Please sign in again`)

  const config = req.app.locals.config.server

  const {
    exp,
    secret,
    algorithms
  } = config.jwt

  // Add the user data to the jwt
  const jwtToken = jwt.sign({
    userId: id,
    token: token,
    username: username,
    provider: provider, 
  }, secret, { algorithm: algorithms[0], expiresIn: exp })

  // Preload the users repos from the provider
  const repos = await Repo.getUserRepos({ token })

  return apiRes(req, res, {id, username, provider, repos, jwt: jwtToken}, 200)
})

module.exports = {
  validate,
}
