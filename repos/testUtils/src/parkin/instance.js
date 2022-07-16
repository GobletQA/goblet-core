// TODO: Figure out a way to load a parkin instance relative to a repo
// This is needed when loading definitions from the backend API
// The Repo instance holds an instance of Parkin that needs to be used here instead of creating one
// Need to figure out a way to override the instance here, and use the Repos Parkin instance
const { Parkin } = require('@ltipton/parkin')
const { getWorld } = require('@GTU/Support/world')

let __ParkinInstance

// Sets a new instance of the Parkin Class to the __ParkinInstance variable
// Currently not called anywhere
const setParkinInstance = (instance) => {
  if(instance && instance !== __ParkinInstance) __ParkinInstance = instance

  __ParkinInstance = __ParkinInstance || new Parkin(getWorld())

  return __ParkinInstance
}

const getParkinInstance = () => {
  __ParkinInstance = __ParkinInstance || new Parkin(getWorld())
  return __ParkinInstance
}

/**
 * Parkin singleton instance, accepting the
 * goblet world: a merge of goblet defaults with
 * the client's world object
 */
module.exports = {
  getParkinInstance,
  setParkinInstance,
}
