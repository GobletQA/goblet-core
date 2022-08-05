const { asyncWrap, apiRes } = require('@gobletqa/shared/express')

/**
 * Loads the Parkin World object and passes it to the frontend
 */
const loadRepoWorld = asyncWrap(async (req, res) => {
  const world = await res.locals.repo.refreshWorld()
  return apiRes(req, res, { world }, 200)
})

module.exports = {
  loadRepoWorld,
}
