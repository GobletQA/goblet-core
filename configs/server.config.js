const path = require('path')
const rootDir = path.join(__dirname, '../')
const { API_PORT } = process.env
const serverConfig = {
  port: API_PORT || '5005',
  host: '0.0.0.0',
  path: '/sockr-socket',
  logLevel: 'debug',
  process: {
    debug: true,
    root: rootDir,
    script: path.join(rootDir, 'scripts/sockr.cmd.sh'),
  }
}

module.exports = {
  serverConfig
}