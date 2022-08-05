const { asyncWrap, apiRes } = require('@gobletqa/shared/express')
const { getFeatures } = require('@gobletqa/shared/repo/getFeatures')
const { fileModelArrayToObj } = require('@gobletqa/shared/utils/fileModelArrayToObj')

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
