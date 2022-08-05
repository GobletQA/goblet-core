const { Repo } = require('@gobletqa/shared/repo/repo')
const { asyncWrap, apiRes } = require('@gobletqa/shared/express')
const { loadRepoContent } = require('@gobletqa/shared/repo/loadRepoContent')

/**
 * Runs the initializeGoblet workflow to setup a new repository
 */
const connectRepo = asyncWrap(async (req, res) => {
  const { iat, exp, ...user } = req.user

  // TODO: Add req.body / req.user validation before running
  const repo = await Repo.fromWorkflow({
    ...user,
    ...req.body,
  })

  const { config } = req.app.locals
  const content = await loadRepoContent(repo, config)

  return apiRes(req, res, content, 200)
})

module.exports = {
  connectRepo,
}
