const { asyncWrap, apiRes } = require('@gobletqa/shared/express')
const { loadDefinitions } = require('@gobletqa/shared/libs/definitions/definitions')
const { definitionsByType } = require('@gobletqa/shared/utils/definitionsByType')
const { fileModelArrayToObj } = require('@gobletqa/shared/utils/fileModelArrayToObj')

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
