const { asyncWrap, apiRes } = require('@gobletqa/shared/express')
const { getGobletFile } = require('@gobletqa/shared/libs/fileSys/gobletFiles')

/**
 * Loads a file from within the docker mounted test root folder
 *
 * @returns {Object} - response object model containing the loaded fileModel
 */
const loadFile = asyncWrap(async (req, res) => {
  const filePath = req.query.path
  const file = await getGobletFile(res.locals.repo, filePath)

  return apiRes(req, res, (file ? {file} : {}), 200)
})

module.exports = {
  loadFile,
}
