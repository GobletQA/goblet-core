const { Repo } = require('@GSH/Repo/repo')
const { asyncWrap, apiRes } = require('@GSH/Exp')

/**
 * Endpoint to get all repos from the authorized provider
 * Calls Repo.getUserRepos which calls the workflow getUserRepos method
 */
const getRepos = asyncWrap(async (req, res) => {
  const { iat, exp, ...user } = req.user
  const repos = await Repo.getUserRepos(user)

  return apiRes(req, res, {repos}, 200)
})

module.exports = {
  getRepos,
}
