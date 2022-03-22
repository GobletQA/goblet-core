const { loadDefinitions } = require('HerkinBackLibs/definitions')
const { asyncWrap, apiRes } = require('HerkinSharedExp')
const { definitionsByType, fileModelArrayToObj } = require('HerkinShared/utils')

const getDefinitions = asyncWrap(async (req, res) => {
  const definitions = await loadDefinitions(
    res.locals.repo,
    req.app.locals.config
  )
  const definitionTypes = definitionsByType(definitions)

  return apiRes(
    req,
    res,
    {
      definitionTypes,
      definitions: fileModelArrayToObj(definitions),
    },
    200
  )
})

module.exports = {
  getDefinitions,
}
