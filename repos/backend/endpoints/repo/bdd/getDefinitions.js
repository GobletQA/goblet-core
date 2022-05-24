const { asyncWrap, apiRes } = require('HerkinSharedExp')
const { loadDefinitions } = require('HerkinSharedDefinitions/definitions')
const { definitionsByType } = require('HerkinSharedUtils/definitionsByType')
const { fileModelArrayToObj } = require('HerkinSharedUtils/fileModelArrayToObj')

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
