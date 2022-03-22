require('../../configs/aliases.config').registerAliases()
const { initApi } = require('./src/server')

const start = () => {
  process.on('SIGINT', () => {
    console.log(`[Screencast] Force Killing screencast server...`)
    process.exit()
  })

  initApi()
}

!module.parent && module.id !== '.'
  ? start()
  : (module.exports = {
      ...require('./src/libs'),
      ...require('./src/screencast'),
    })
