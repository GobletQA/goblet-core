const { AppRouter } = require('HerkinSharedRouter')

module.exports = () => {
  AppRouter.post('/auth/refresh', require('./refresh').refresh)
  AppRouter.post('/auth/validate', require('./validate').validate)
}
