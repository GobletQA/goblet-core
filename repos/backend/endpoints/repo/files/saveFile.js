const { saveHerkinFile } = require('GobletSharedFileSys/herkinFiles')
const { asyncWrap, apiRes } = require('GobletSharedExp')

/**
 * Saves a file to a location within the docker mounted test root folder
 *
 * @returns {Object} - response object model containing the saved fileModel
 */
const saveFile = asyncWrap(async (req, res) => {
  const {path:location, content, type} = req.body
  if (!location) throw new Error(`[Backend API] Save failed: location required`)

  const meta = await saveHerkinFile(res.locals.repo, location, content, type)

  return apiRes(req, res, meta || {}, 200)
})

module.exports = {
  saveFile,
}
