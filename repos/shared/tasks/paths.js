const path = require('path')
const { GSHRoot } = require('../resolveRoot')

module.exports = {
  GSHRoot,
  configs: path.join(GSHRoot, './configs'),
}
