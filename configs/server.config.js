const path = require('path')
const { toBool } = require('@keg-hub/jsutils')

const rootDir = path.join(__dirname, '../')
const {
  HERKIN_USE_AUTH,
  API_PORT = '5005',
  HERKIN_PW_SOCKET,
  HERKIN_SERVER_ORIGINS='',
  HERKIN_LOG_LEVEL = 'debug',
  HERKIN_SERVER_HOST = '0.0.0.0',
  HERKIN_SOCKR_PATH = '/sockr-socket',
  HERKIN_COOKIE_KEY = `keg-herkin-cookie-7979`,
  HERKIN_COOKIE_NAME = `keg-herkin`
} = process.env

const serverConfig = {
  port: API_PORT,
  path: HERKIN_SOCKR_PATH,
  host: HERKIN_SERVER_HOST,
  logLevel: HERKIN_LOG_LEVEL,
  origins: HERKIN_SERVER_ORIGINS.split(','),
  process: {
    root: rootDir,
    debug: Boolean(HERKIN_LOG_LEVEL == 'debug'),
    script: path.join(rootDir, 'scripts/sockr.cmd.sh'),
  },
  hostPWSocket: toBool(HERKIN_PW_SOCKET),
  auth: toBool(HERKIN_USE_AUTH),
  cookie: {
    keg: HERKIN_COOKIE_KEY,
    name: HERKIN_COOKIE_NAME,
  }
}

module.exports = {
  serverConfig,
}
