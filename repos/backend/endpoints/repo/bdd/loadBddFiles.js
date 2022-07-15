const { asyncWrap, apiRes } = require('@GSH/Exp')
const { getFeatures } = require('@GSH/Repo/getFeatures')
const { fileModelArrayToObj } = require('@GSH/Utils/fileModelArrayToObj')

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
