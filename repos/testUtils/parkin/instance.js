const { Parkin } = require('@ltipton/parkin')
const { getWorld } = require('HerkinRepos/testUtils/support')

/**
 * Parkin singleton instance, accepting the
 * herkin world: a merge of herkin defaults with
 * the client's world object
 */
module.exports = {
  // TODO: Need to validate that the correct config gets loaded here
  // Would be better to load the correct herkin config and pass it to getWorld
  parkin: new Parkin(getWorld()),
}
