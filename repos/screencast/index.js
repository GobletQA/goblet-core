require('../../configs/aliases.config').registerAliases()

module.exports = {
  ...require('./src/libs'),
  ...require('./src/screencast'),
}