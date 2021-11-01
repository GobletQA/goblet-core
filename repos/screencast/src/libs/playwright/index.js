module.exports = {
  ...require('./browser'),
  ...require('./server'),
  ...require('./helpers/getBrowsers'),
  ...require('./helpers/getBrowserOpts'),
  metadata: require('./helpers/metadata'),
}