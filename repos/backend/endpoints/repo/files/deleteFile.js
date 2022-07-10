const { deleteGobletFile } = require('GobletSharedFileSys/gobletFiles')
const { asyncWrap, apiRes } = require('GobletSharedExp')

/**
 * Deletes an file located within the docker mounted test root folder
 *
 * @returns {Object} - response object model
 */
const deleteFile = asyncWrap(async (req, res) => {
  const { file } = req.query
  const meta = await deleteGobletFile(res.locals.repo, file)

  return apiRes(req, res, meta || {}, 200)
})

module.exports = {
  deleteFile,
}
