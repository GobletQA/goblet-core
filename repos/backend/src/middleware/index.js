module.exports = {
  ...require('./setReqRepo'),
  ...require('./setupVNCProxy'),
  ...require('./setupBlacklist'),
  ...require('./setupServerListen'),
  ...require('./validateUser'),
}
