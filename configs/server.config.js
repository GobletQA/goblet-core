const path = require('path')
const rootDir = path.join(__dirname, '../')
const { toBool } = require('@keg-hub/jsutils')
const { loadEnvs } = require('../repos/shared/utils/loadEnvs')
const nodeEnv = process.env.NODE_ENV || `local`

loadEnvs(nodeEnv === 'local')

// TODO: @lance-tipton - Remove these defaults. Should come from values files
const {
  GOBLET_JWT_EXP,
  GOBLET_JWT_ALGO,
  GOBLET_JWT_SECRET,
  GOBLET_JWT_CREDENTIALS,
  GOBLET_JWT_REFRESH_EXP,
  GOBLET_JWT_REFRESH_SECRET,
  GOBLET_USE_AUTH,
  API_PORT = '5005',
  API_SECURE_PORT='443',
  GOBLET_PW_SOCKET,
  GOBLET_SOCKET_PORT,
  GOBLET_SOCKET_HOST,
  GOBLET_COOKIE_SECRET,
  GOBLET_LOG_LEVEL = 'debug',
  GOBLET_COOKIE_SECURE = true,
  GOBLET_SERVER_HOST = '0.0.0.0',
  GOBLET_COOKIE_HTTP_ONLY = true,
  GOBLET_COOKIE_OVERWRITE = true,
  GOBLET_COOKIE_SAME_SITE = `None`,
  GOBLET_COOKIE_NAME = `goblet`,
  GOBLET_SOCKR_PATH = '/sockr-socket',
  GOBLET_COOKIE_KEY = `goblet-cookie-7979`,
  GOBLET_COOKIE_MAX_AGE = 12 * 60 * 60 * 1000,
  GOBLET_COOKIE_EXP = new Date(new Date().getTime() + 86400000),
  GOBLET_SERVER_ORIGINS = 'localhost,dev.gobletqa.app,gobletqa-develop.local.keghub.io',
} = process.env

// TODO: @lance-tipton - extract to shared utility methods
const generateOrigins = () => {
  return (GOBLET_SERVER_ORIGINS).split(',')
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
  environment: nodeEnv,
  securePort: API_SECURE_PORT,
  path: GOBLET_SOCKR_PATH,
  host: GOBLET_SERVER_HOST,
  logLevel: GOBLET_LOG_LEVEL,
  origins: generateOrigins(),
  auth: toBool(GOBLET_USE_AUTH),
  hostPWSocket: toBool(GOBLET_PW_SOCKET),
  cookie: {
    key: GOBLET_COOKIE_KEY,
    name: GOBLET_COOKIE_NAME,
    expires: GOBLET_COOKIE_EXP,
    secret: GOBLET_COOKIE_SECRET,
    maxAge: GOBLET_COOKIE_MAX_AGE,
    sameSite: GOBLET_COOKIE_SAME_SITE,
    secure: toBool(GOBLET_COOKIE_SECURE),
    httpOnly: toBool(GOBLET_COOKIE_HTTP_ONLY),
    overwrite: toBool(GOBLET_COOKIE_OVERWRITE),
  },
  sockr: {
    path: GOBLET_SOCKR_PATH,
    port: GOBLET_SOCKET_PORT || API_PORT,
    host: GOBLET_SOCKET_HOST || GOBLET_SERVER_HOST,
    process: {
      root: rootDir,
      debug: Boolean(GOBLET_LOG_LEVEL == 'debug'),
      script: path.join(rootDir, 'scripts/sockr.cmd.sh'),
    },
  },
  jwt: {
    exp: GOBLET_JWT_EXP,
    secret: GOBLET_JWT_SECRET,
    refreshExp: GOBLET_JWT_REFRESH_EXP,
    refreshSecret: GOBLET_JWT_REFRESH_SECRET,
    algorithms: [GOBLET_JWT_ALGO || 'HS256'],
    credentialsRequired: toBool(GOBLET_JWT_CREDENTIALS || true),
  }
}

module.exports = {
  serverConfig,
}

