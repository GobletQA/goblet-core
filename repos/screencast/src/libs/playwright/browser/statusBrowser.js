const { getBrowserStatus } = require('../helpers/getBrowserStatus')

// Reexport getBrowserStatus as statusBrowser for consistency
module.exports = {
  statusBrowser: getBrowserStatus,
}
