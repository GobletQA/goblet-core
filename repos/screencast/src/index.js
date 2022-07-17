#!/usr/bin/env node
require('../resolveRoot')
const { initApi } = require('./server')

const start = () => {
  process.on('SIGINT', () => {
    console.log(`[Screencast] Force Killing screencast server...`)
    process.exit()
  })

  initApi()
}

require.main === module
  ? start()
  : (module.exports = {
      ...require('./libs'),
      ...require('./screencast'),
    })

