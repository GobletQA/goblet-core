const { loadFeatures } = require('HerkinBackLibs/features')
const { asyncWrap, apiRes } = require('HerkinSharedExp')

const getFeatures = asyncWrap(async (req, res) => {
  const features = await loadFeatures(res.locals.repo)

  return apiRes(req, res, features || [], 200)
})

module.exports = {
  getFeatures,
}
