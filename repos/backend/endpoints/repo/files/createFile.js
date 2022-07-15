const { createGobletFile } = require('@GSH/FileSys/gobletFiles')
const { asyncWrap, apiRes } = require('@GSH/Exp')

/**
 * Creates new file based on file type within the docker mounted test root folder
 *
 * @returns {Object} - response object model containing the saved fileModel
 */
const createFile = asyncWrap(async (req, res) => {
  const { name, type } = req.body
  const meta = await createGobletFile(res.locals.repo, name, type)

  return apiRes(req, res, meta, 200)
})

module.exports = {
  createFile,
}
