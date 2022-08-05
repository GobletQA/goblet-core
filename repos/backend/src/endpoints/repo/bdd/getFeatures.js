const { asyncWrap, apiRes } = require('@gobletqa/shared/express')
const { loadFeatures } = require('@gobletqa/shared/libs/features/features')

const getFeatures = asyncWrap(async (req, res) => {
  const features = await loadFeatures(res.locals.repo)

  return apiRes(req, res, features || [], 200)
})

module.exports = {
  getFeatures,
}
