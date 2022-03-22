const { Repo } = require('HerkinBackLibs/repo')
const { asyncWrap, apiRes } = require('HerkinSharedExp')
const { loadRepoContent } = require('../../../utils/loadRepoContent')

/**
 * Runs the initializeHerkin workflow to setup a new repository
 */
const connectRepo = asyncWrap(async (req, res) => {
  // TODO: Add req.body / req.session validation before running
  const repo = await Repo.fromWorkflow({
    ...req.session,
    ...req.body,
  })

  const { config } = req.app.locals
  const content = await loadRepoContent(repo, config)

  return apiRes(req, res, content, 200)
})

module.exports = {
  connectRepo,
}
