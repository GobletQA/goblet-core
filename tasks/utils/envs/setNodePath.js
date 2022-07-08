const path = require('path')
const { appRoot } = require('../../paths')
const gobletNodeMods = path.join(appRoot, 'node_modules')

/**
 * Sets the NODE_PATH env to allow loading node_modules from a custom directory
 * TODO: investigate this further
 * Either this, or symlink goblet/node_modules to /keg/node_modules
 * @param {Object} env - Env object to add the NODE_PATH env to
 * @param {string} location - Path that NODE_PATH should be set to
 * @param {boolean} overwrite - If NODE_PATH is already set, overwrite it with the location argument
 */
const setNodePath = (env={}, overwrite, location=gobletNodeMods) => {
  env.NODE_PATH = overwrite ? location : process.env.NODE_PATH || location

  return env
}

module.exports = {
  setNodePath
}