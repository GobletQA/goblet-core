const { AppRouter } = require('@gobletqa/shared/express/appRouter')

module.exports = () => {
  AppRouter.post('/auth/refresh', require('./refresh').refresh)
  AppRouter.post('/auth/validate', require('./validate').validate)
}
