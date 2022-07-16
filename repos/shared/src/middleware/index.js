module.exports = {
  ...require('./setupJWT'),
  ...require('./setupCors'),
  ...require('./setupCookie'),
  ...require('./setupLogger'),
  ...require('./setupServer'),
  ...require('./setupStatic'),
  ...require('./setupBlacklist'),
  ...require('./setupServerListen'),
}
