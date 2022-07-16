const { asyncWrap, apiRes } = require('@GSH/Exp')

const getRepo = asyncWrap(async (req, res) => {
  return apiRes(req, res, { repo: res.locals.repo }, 200)
})

module.exports = {
  getRepo,
}
