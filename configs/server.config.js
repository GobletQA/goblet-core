const path = require('path')
const rootDir = path.join(__dirname, '../')
const { toBool } = require('@keg-hub/jsutils')
const { loadEnvs } = require('../repos/shared/utils/loadEnvs')
const nodeEnv = process.env.NODE_ENV || `local`

loadEnvs(nodeEnv === 'local')

// TODO: @lance-tipton - Remove these defaults. Should come from values files
const {
  HERKIN_USE_AUTH,
  API_PORT = '5005',
  HERKIN_PW_SOCKET,
  HERKIN_COOKIE_SECRET,
  HERKIN_LOG_LEVEL = 'debug',
  HERKIN_COOKIE_SECURE = true,
  HERKIN_SERVER_HOST = '0.0.0.0',
  HERKIN_COOKIE_HTTP_ONLY = true,
  HERKIN_COOKIE_OVERWRITE = true,
  HERKIN_COOKIE_SAME_SITE = `None`,
  HERKIN_COOKIE_NAME = `keg-herkin`,
  HERKIN_SOCKR_PATH = '/sockr-socket',
  HERKIN_COOKIE_KEY = `keg-herkin-cookie-7979`,
  HERKIN_COOKIE_MAX_AGE = 12 * 60 * 60 * 1000,
  HERKIN_COOKIE_EXP = new Date(new Date().getTime() + 86400000),
  HERKIN_SERVER_ORIGINS = 'localhost,dev.herkin.app,hekin.dev.app,herkin-develop.local.keghub.io',
} = process.env

// TODO: @lance-tipton - extract to shared utility methods
const generateOrigins = () => {
  return (HERKIN_SERVER_ORIGINS).split(',')
    .reduce((acc, origin) => {
      const host = (origin || '').trim()
      if(!host || acc.includes(host)) return acc

      const cleaned = host.replace(`https://`, '')
        .replace(`http://`, '')
        .replace(`wss://`, '')
        .replace(`ws://`, '')
      
      !acc.includes(cleaned) &&
        acc.push(
          cleaned,
          `https://${cleaned}`,
          `http://${cleaned}`,
          `wss://${cleaned}`,
          `ws://${cleaned}`
        )

      return acc
    }, [])
}

const serverConfig = {
  port: API_PORT,
  path: HERKIN_SOCKR_PATH,
  host: HERKIN_SERVER_HOST,
  logLevel: HERKIN_LOG_LEVEL,
  origins: generateOrigins(),
  process: {
    root: rootDir,
    debug: Boolean(HERKIN_LOG_LEVEL == 'debug'),
    script: path.join(rootDir, 'scripts/sockr.cmd.sh'),
  },
  hostPWSocket: toBool(HERKIN_PW_SOCKET),
  auth: toBool(HERKIN_USE_AUTH),
  cookie: {
    key: HERKIN_COOKIE_KEY,
    name: HERKIN_COOKIE_NAME,
    expires: HERKIN_COOKIE_EXP,
    secret: HERKIN_COOKIE_SECRET,
    maxAge: HERKIN_COOKIE_MAX_AGE,
    sameSite: HERKIN_COOKIE_SAME_SITE,
    secure: toBool(HERKIN_COOKIE_SECURE),
    httpOnly: toBool(HERKIN_COOKIE_HTTP_ONLY),
    overwrite: toBool(HERKIN_COOKIE_OVERWRITE),
  }
}

module.exports = {
  serverConfig,
}

