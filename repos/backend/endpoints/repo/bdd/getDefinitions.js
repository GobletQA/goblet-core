const { asyncWrap, apiRes } = require('GobletSharedExp')
const { loadDefinitions } = require('GobletSharedDefinitions/definitions')
const { definitionsByType } = require('GobletSharedUtils/definitionsByType')
const { fileModelArrayToObj } = require('GobletSharedUtils/fileModelArrayToObj')

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
