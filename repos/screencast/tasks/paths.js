const path = require('path')
const { GSCRoot } = require('../resolveRoot')

module.exports = {
  GSCRoot,
  configs: path.join(GSCRoot, './configs'),
}
