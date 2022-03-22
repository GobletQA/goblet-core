const { asyncWrap, apiRes } = require('HerkinSharedExp')
const { getHerkinFile } = require('HerkinBackLibs/fileSys/herkinFiles')

/**
 * Loads a file from within the docker mounted test root folder
 *
 * @returns {Object} - response object model containing the loaded fileModel
 */
const loadFile = asyncWrap(async (req, res) => {
  const filePath = req.query.path
  const file = await getHerkinFile(res.locals.repo, filePath)

  return apiRes(req, res, (file ? {file} : {}), 200)
})

module.exports = {
  loadFile,
}
