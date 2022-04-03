module.exports = {
  ...require('./setupCors'),
  ...require('./setupCookie'),
  ...require('./setupLogger'),
  ...require('./setupWinston'),
  ...require('./setupServer'),
  ...require('./setupStatic'),
}
