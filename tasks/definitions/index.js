const { initialize } = require('../utils/helpers/initDefs')
const { GOBLET_RUN_FROM_CI } = process.env

const definitions = !GOBLET_RUN_FROM_CI && {
  ...initialize(require('./tap')),
  ...initialize(require('./deploy')),
  ...initialize(require('./metadata')),
}

module.exports = {
  ...definitions,
  ...initialize(require('./bdd')),
  ...initialize(require('./unit')),
  ...initialize(require('./waypoint'))
}
