const path = require('path')
const { GTapRoot } = require('../resolveRoot')

module.exports = {
  GTapRoot,
  configs: path.join(GTapRoot, './configs'),
}
