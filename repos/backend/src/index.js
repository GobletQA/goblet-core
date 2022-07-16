require('../../../configs/aliases.config').registerAliases()
const { initApi } = require('./server')

const start = () => {
  process.on('SIGINT', () => {
    console.log(`[Backend API] Force Killing api server...`)
    process.exit()
  })

  initApi()
}

!module.parent
  ? start()
  : (module.exports = () => {
      initApi()
    })
