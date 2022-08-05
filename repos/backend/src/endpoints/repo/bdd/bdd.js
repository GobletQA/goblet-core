const { AppRouter } = require('@gobletqa/shared/express/appRouter')

module.exports = () => {
  AppRouter.get('/repo/:repo/bdd', require('./loadBddFiles').loadBddFiles)
  AppRouter.get('/repo/:repo/features', require('./getFeatures').getFeatures)
  AppRouter.get(
    '/repo/:repo/definitions',
    require('./getDefinitions').getDefinitions
  )
}
