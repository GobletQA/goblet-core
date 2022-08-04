const path = require('path')
const { toBool } = require('@keg-hub/jsutils')
const { GobletRoot } = require('../gobletRoot')
// TODO: figure out how to make these an alias instead of relative path
const { loadEnvs } = require('../repos/shared/src/utils/loadEnvs')
const { generateOrigins } = require('../repos/shared/src/utils/generateOrigins')

const nodeEnv = process.env.NODE_ENV || `local`
loadEnvs({ override: nodeEnv === 'local'})

// TODO: @lance-tipton - Remove these defaults. Should come from values files
const {

  GB_LOG_LEVEL,
  GB_SERVER_ORIGINS,
  GB_AUTH_ACTIVE,
  GB_PW_SOCKET_ACTIVE,

  GB_BE_SOCKR_PATH,
  GB_BE_SOCKET_PORT,
  GB_BE_SOCKET_HOST,

  GB_BE_PORT,
  GB_BE_HOST,
  GB_BE_SECURE_PORT,

  GB_BE_JWT_EXP,
  GB_BE_JWT_ALGO,
  GB_BE_JWT_SECRET,
  GB_BE_JWT_CREDENTIALS,
  GB_BE_JWT_REFRESH_EXP,
  GB_BE_JWT_REFRESH_SECRET,

  GB_BE_COOKIE_SECRET,
  GB_BE_COOKIE_SECURE = true,
  GB_BE_COOKIE_NAME = `goblet`,
  GB_BE_COOKIE_HTTP_ONLY = true,
  GB_BE_COOKIE_OVERWRITE = true,
  GB_BE_COOKIE_SAME_SITE = `None`,
  GB_BE_COOKIE_KEY = `goblet-cookie-7979`,
  GB_BE_COOKIE_MAX_AGE = 12 * 60 * 60 * 1000,
  GB_BE_COOKIE_EXP = new Date(new Date().getTime() + 86400000),
} = process.env

const serverConfig = {
  port: GB_BE_PORT,
  host: GB_BE_HOST,
  securePort: GB_BE_SECURE_PORT,
  environment: nodeEnv,
  path: GB_BE_SOCKR_PATH,
  logLevel: GB_LOG_LEVEL,
  auth: toBool(GB_AUTH_ACTIVE),
  hostPWSocket: toBool(GB_PW_SOCKET_ACTIVE),
  origins: generateOrigins(GB_SERVER_ORIGINS),
  cookie: {
    key: GB_BE_COOKIE_KEY,
    name: GB_BE_COOKIE_NAME,
    expires: GB_BE_COOKIE_EXP,
    secret: GB_BE_COOKIE_SECRET,
    maxAge: GB_BE_COOKIE_MAX_AGE,
    sameSite: GB_BE_COOKIE_SAME_SITE,
    secure: toBool(GB_BE_COOKIE_SECURE),
    httpOnly: toBool(GB_BE_COOKIE_HTTP_ONLY),
    overwrite: toBool(GB_BE_COOKIE_OVERWRITE),
  },
  sockr: {
    path: GB_BE_SOCKR_PATH,
    port: GB_BE_SOCKET_PORT || GB_BE_PORT,
    host: GB_BE_SOCKET_HOST || GB_BE_HOST,
    process: {
      root: GobletRoot,
      debug: Boolean(GB_LOG_LEVEL == 'debug'),
      script: path.join(GobletRoot, 'scripts/sockr.cmd.sh'),
    },
  },
  jwt: {
    exp: GB_BE_JWT_EXP,
    secret: GB_BE_JWT_SECRET,
    refreshExp: GB_BE_JWT_REFRESH_EXP,
    refreshSecret: GB_BE_JWT_REFRESH_SECRET,
    algorithms: [GB_BE_JWT_ALGO || 'HS256'],
    credentialsRequired: toBool(GB_BE_JWT_CREDENTIALS || true),
  }
}

module.exports = {
  serverConfig,
}

