const { Repo } = require('@GSH/Repo/repo')
const { asyncWrap, apiRes } = require('@GSH/Exp')
const { loadRepoContent } = require('@GSH/Repo/loadRepoContent')

/**
 * Could be used to get repos when unmounted and in vnc mode, but logged in
 * Makes the initial status query take a while, so skipping for now
 * May want to add later, so keeping the code
 */
const handleUnmounted = async (req, res, status) => {
  const { query, session } = req
  if(!session.token || status.mode !== 'vnc') return apiRes(req, res, { status })

  const repos = !query.getRepos &&
    await Repo.getUserRepos(session)

  return apiRes(req, res, {status, repos})
}

/**
 * Gets the status of a connected repo
 * Calls the statusGoblet workflow
 */
const statusRepo = asyncWrap(async (req, res) => {
  const { query } = req
  const { config } = req.app.locals
  const { repo, status } = await Repo.status(config, query)

  // If not mounted, return the unmounted status, so the ui can update base on the mode
  // In local mode, it just shows the editor
  // In VNC mode, it shows the git modal to connect a repo
  if (!status.mounted) return apiRes(req, res, { status })

  // If we get here only if repo exists on res.locals or status.repo
  const foundRepo = repo || res.locals.repo

  // Extra check just incase we missed something
  if (!foundRepo) {
    const error = new Error(`Error getting repo status. No repo exists.`)
    error.code = 422
    throw error
  }

  const repoContent = await loadRepoContent(foundRepo, config, status)

  return apiRes(req, res, repoContent)
})

module.exports = {
  statusRepo,
}
