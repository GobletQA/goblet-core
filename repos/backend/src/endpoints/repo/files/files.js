const { AppRouter } = require('@gobletqa/shared/express/appRouter')

module.exports = () => {
  AppRouter.get('/repo/:repo/files/tree', require('./getTree').getTree)
  AppRouter.get('/repo/:repo/files/load', require('./loadFile').loadFile)
  AppRouter.post('/repo/:repo/files/save', require('./saveFile').saveFile)
  AppRouter.post('/repo/:repo/files/create', require('./createFile').createFile)
  AppRouter.delete('/repo/:repo/files/delete', require('./deleteFile').deleteFile)
}
