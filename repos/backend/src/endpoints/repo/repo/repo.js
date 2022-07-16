const { AppRouter } = require('@GSH/Router')

module.exports = () => {
  AppRouter.get('/repo', require('./getRepo').getRepo)
  AppRouter.get('/repo/all', require('./getRepos').getRepos)
  AppRouter.get('/repo/status', require('./statusRepo').statusRepo)
  AppRouter.get('/repo/world', require('./loadRepoWorld').loadRepoWorld)
  AppRouter.post('/repo/connect', require('./connectRepo').connectRepo)
  AppRouter.post('/repo/disconnect', require('./disconnectRepo').disconnectRepo)
}
