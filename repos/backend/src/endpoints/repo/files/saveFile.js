const { saveGobletFile } = require('@gobletqa/shared/libs/fileSys/gobletFiles')
const { asyncWrap, apiRes } = require('@gobletqa/shared/express')

/**
 * Saves a file to a location within the docker mounted test root folder
 *
 * @returns {Object} - response object model containing the saved fileModel
 */
const saveFile = asyncWrap(async (req, res) => {
  const {path:location, content, type} = req.body
  if (!location) throw new Error(`[Backend API] Save failed: location required`)

  const meta = await saveGobletFile(res.locals.repo, location, content, type)

  return apiRes(req, res, meta || {}, 200)
})

module.exports = {
  saveFile,
}
