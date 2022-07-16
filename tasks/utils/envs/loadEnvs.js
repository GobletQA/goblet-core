const path  = require('path')
const { appRoot } = require('../../paths')
const { loadEnvs } = require(path.join(appRoot, 'repos/shared/src/utils/loadEnvs'))

module.exports = {
  loadEnvs,
}
