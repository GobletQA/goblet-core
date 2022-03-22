const { loadFeatures } = require('HerkinBackLibs/features')
const { loadDefinitions } = require('HerkinBackLibs/definitions')
const { asyncWrap, apiRes } = require('HerkinSharedExp')
const { definitionsByType, fileModelArrayToObj } = require('HerkinShared/utils')

const loadBddFiles = asyncWrap(async (req, res) => {
  const definitions = await loadDefinitions(
    res.locals.repo,
    req.app.locals.config
  )
  const definitionTypes = definitionsByType(definitions)
  const features = await loadFeatures(res.locals.repo, definitionTypes)

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
