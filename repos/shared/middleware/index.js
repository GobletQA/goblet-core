module.exports = {
  ...require('./setupCors'),
  ...require('./setupCookie'),
  ...require('./setupLogger'),
  ...require('./setupServer'),
  ...require('./setupStatic'),
}
