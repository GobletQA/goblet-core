const path = require('path')
const { GBKRoot } = require('../resolveRoot')

module.exports = {
  GBKRoot,
  configs: path.join(GBKRoot, './configs'),
}
