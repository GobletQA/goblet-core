module.exports = {
  ...require('./browser'),
  ...require('./server'),
  ...require('./helpers/getBrowserType'),
  ...require('./helpers/getBrowsers'),
  ...require('./helpers/getBrowserOpts'),
  ...require('./helpers/getContextOpts'),
  metadata: require('./helpers/metadata'),
}
