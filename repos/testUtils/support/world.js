const { deepMerge } = require('@keg-hub/jsutils')
const { getClientWorld } = require('./getClientWorld')

/**
 * Merge of world defaults with client world
 */
const getWorld = config => {
  return deepMerge(
    {
      app: {
        url: process.env.GOBLET_APP_URL,
      },
    },
    getClientWorld(config)
  )
}

module.exports = {
  getWorld,
  // This is the initial world
  // Here for backwards compatibility
  // Will be removed at some point
  world: getWorld(),
}
