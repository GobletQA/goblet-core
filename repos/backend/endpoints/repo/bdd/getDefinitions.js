const { asyncWrap, apiRes } = require('@GSH/Exp')
const { loadDefinitions } = require('@GSH/Definitions/definitions')
const { definitionsByType } = require('@GSH/Utils/definitionsByType')
const { fileModelArrayToObj } = require('@GSH/Utils/fileModelArrayToObj')

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
