const { Repo } = require('HerkinBackLibs/repo')
const { asyncWrap, apiRes } = require('HerkinSharedExp')

/**
 * Endpoint to get all repos from the authorized provider
 * Calls Repo.getUserRepos which calls the workflow getUserRepos method
 */
const getRepos = asyncWrap(async (req, res) => {
  const repos = await Repo.getUserRepos(req.session)

  return apiRes(req, res, {repos}, 200)
})

module.exports = {
  getRepos,
}
