const { setPage } = require('./browser')

module.exports = {
  setPage,
  ...require('./newBrowser'),
  ...require('./restartBrowser'),
  ...require('./startBrowser'),
  ...require('./stopBrowser'),
  ...require('./statusBrowser'),
  ...require('./actionBrowser'),
}
