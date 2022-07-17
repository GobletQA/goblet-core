#!/usr/bin/env node
const { initApi } = require('./server')

const start = () => {
  process.on('SIGINT', () => {
    console.log(`[Backend API] Force Killing api server...`)
    process.exit()
  })

  initApi()
}

start()
