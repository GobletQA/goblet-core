const { asyncWrap, apiRes } = require('@GSH/Exp')
const { loadFeatures } = require('@GSH/Features/features')

const getFeatures = asyncWrap(async (req, res) => {
  const features = await loadFeatures(res.locals.repo)

  return apiRes(req, res, features || [], 200)
})

module.exports = {
  getFeatures,
}
