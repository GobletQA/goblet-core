const path = require('path')
const { GTURoot } = require('../resolveRoot')

module.exports = {
  GTURoot,
  configs: path.join(GTURoot, './configs'),
}
