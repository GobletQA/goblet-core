const { Parkin } = require('@ltipton/parkin')
const { getWorld } = require('HerkinSupport')

let __ParkinInstance = new Parkin(getWorld())

const setParkinInstance = (instance) => {
  if(instance && instance !== __ParkinInstance) __ParkinInstance = instance

  return __ParkinInstance
}

const getParkinInstance = () => {
  return __ParkinInstance
}

/**
 * Parkin singleton instance, accepting the
 * herkin world: a merge of herkin defaults with
 * the client's world object
 */
module.exports = {
  getParkinInstance,
  setParkinInstance,
  // TODO: Need to validate that the correct config gets loaded here
  // Would be better to load the correct herkin config and pass it to getWorld
  parkin: __ParkinInstance,
}
