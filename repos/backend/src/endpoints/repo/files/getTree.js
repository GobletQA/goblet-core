const { asyncWrap, apiRes } = require('@gobletqa/shared/express')
const { buildFileTree } = require('@gobletqa/shared/libs/fileSys/fileTree')

/**
 * Iterates through the docker mounted volume of the test root folder
 * Returns a tree like structure of all the folders/files found within
 *
 * @returns {Object} - { rootPaths: array of root paths, nodes: array of all valid node object }
 */
const getTree = asyncWrap(async (req, res) => {
  const { nodes, rootPaths } = await buildFileTree(res.locals.repo, req.params)

  return apiRes(
    req,
    res,
    {
      nodes,
      rootPaths,
    } || {},
    200
  )
})

module.exports = {
  getTree,
}
