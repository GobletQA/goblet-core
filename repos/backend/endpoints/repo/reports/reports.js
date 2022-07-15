const { AppRouter } = require('@GSH/Router')

module.exports = () => {
  AppRouter.get(
    '/repo/:repo/reports/:fileType/:fileName/list',
    require('./listReports').listReports
  )
  AppRouter.get('/repo/:repo/reports/*', require('./loadReport').loadReport)
}
