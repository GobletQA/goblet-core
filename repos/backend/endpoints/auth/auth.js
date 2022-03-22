const { AppRouter } = require('HerkinSharedRouter')

module.exports = () => {
  AppRouter.post('/auth/validate', require('./validate').validate)
}
