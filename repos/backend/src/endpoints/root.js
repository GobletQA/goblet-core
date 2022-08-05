const { apiRes } = require('@gobletqa/shared/express/apiRes')
const { AppRouter } = require('@gobletqa/shared/express/appRouter')
const { asyncWrap } = require('@gobletqa/shared/express/asyncWrap')

const apiRoot = asyncWrap(async (req, res) => {
  const config = req.app.locals.config

  return apiRes(
    req,
    res,
    {
      host: config.server.host,
      port: config.server.port,
    },
    200
  )
})

module.exports = () => {
  AppRouter.get('/', apiRoot)
}
