require('../../../configs/aliases.config').registerAliases()
module.exports = {
  ...require('./goblet'),
  ...require('./repo/githubAPI'),
}
