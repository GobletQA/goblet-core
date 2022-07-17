const path = require('path')
const { GCDRoot } = require('../resolveRoot')

module.exports = {
  GCDRoot,
  configs: path.join(GCDRoot, './configs'),
}
