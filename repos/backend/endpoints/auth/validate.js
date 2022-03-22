const { Repo } = require('HerkinBackLibs/repo')
const { asyncWrap, apiRes } = require('HerkinSharedExp')

/**
 * Validates the required authentication information exists
 */
const validate = asyncWrap(async (req, res) => {
  const { id, username, token, provider } = req.body

  if (!id || !username || !token || !provider)
    throw new Error(`Provider metadata is unknown. Please sign in again`)

  // Add the user data to the session
  req.session.userId = id
  req.session.token = token
  req.session.username = username
  req.session.provider = provider

  // TODO: throwing an error here to debug Auth Sign in button not showing up
  // When error is thrown, user is logged out, but sign in button is not displayed
  // throw new Error(`Missing sign in button`)
  
  // Preload the users repos from the provider
  const repos = await Repo.getUserRepos({token})

  return apiRes(req, res, {id, username, provider, repos}, 200)
})

module.exports = {
  validate,
}
