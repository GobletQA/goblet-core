const { Repo } = require('@GSH/Repo/repo')
const { asyncWrap, apiRes } = require('@GSH/Exp')

/**
 * Disconnects a connected repo ( VNC mode only )
 */
const disconnectRepo = asyncWrap(async (req, res) => {
  // TODO: Add req.body validation
  const repo = await Repo.disconnect(req.body)
  return apiRes(req, res, { repo }, 200)
})

module.exports = {
  disconnectRepo,
}
