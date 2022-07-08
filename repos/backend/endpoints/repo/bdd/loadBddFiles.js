const { asyncWrap, apiRes } = require('GobletSharedExp')
const { getFeatures } = require('GobletSharedRepo/getFeatures')
const { fileModelArrayToObj } = require('GobletSharedUtils/fileModelArrayToObj')

const loadBddFiles = asyncWrap(async (req, res) => {
  const { definitionTypes, definitions, features } = await getFeatures(
    res.locals.repo,
    req.app.locals.config
  )

  return apiRes(
    req,
    res,
    {
      definitionTypes,
      repo: res.locals.repo,
      features: fileModelArrayToObj(features),
      definitions: fileModelArrayToObj(definitions),
    },
    200
  )
})

module.exports = {
  loadBddFiles,
}
