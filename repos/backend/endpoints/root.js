const { AppRouter } = require('@GSH/Router')
const { asyncWrap, apiRes } = require('@GSH/Exp')

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
