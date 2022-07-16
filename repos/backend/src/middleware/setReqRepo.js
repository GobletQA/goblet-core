const { Repo } = require('@GSH/Repo/repo')
const { AppRouter } = require('@GSH/Router')
const { asyncWrap } = require('@GSH/Exp')
const { pickKeys, deepMerge } = require('@keg-hub/jsutils')

/**
 * Gets the git keys off the request for all request types
 */
const getRepoGit = ({ query, params, body }) => {
  return pickKeys(deepMerge(params, query, body), [
    'path',
    'local',
    'remote',
    'branch',
  ])
}

/**
 * Finds the currently active repo for the request
 * Then ensures it's loaded on the res.locals.repo property
 *
 */
const findRepo = asyncWrap(async (req, res, next) => {
  // If loading a report, we don't need to check repo status
  // Just try to load the report if it exists, so skip loading the repo
  if (req.originalUrl.startsWith(`/repo/${req.params.repo}/reports/`))
    return next()

  const config = req.app.locals.config
  const repoGit = getRepoGit(req)

  if (!repoGit || !repoGit.local)
    throw new Error(
      `Endpoint requires a locally mounted path, I.E. /repo/:repo-name/*`
    )

  const { iat, exp, ...user } = req.user
  const { repo } = await Repo.status(config, { ...repoGit, ...user })

  if (!repo) throw new Error(`Requested repo does not exist`)

  res.locals.repo = repo

  next()
})

/**
 * Middleware to set the repo for each request
 * Ensures the repo instance can be loaded before processes the request
 */
const setReqRepo = app => {
  AppRouter.use('/repo/:repo/*', findRepo)
}

module.exports = {
  setReqRepo,
}
