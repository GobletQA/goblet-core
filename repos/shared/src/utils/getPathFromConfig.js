const path = require('path')
const { getGobletConfig } = require('./getGobletConfig')
const { getRepoGobletDir } = require('./getRepoGobletDir')

/**
 * First gets the baseDir
 * Next, gets a full path from that base dir based on the passed in key
 * @param {string} key - Key in the config.paths object
 * @param {Object} [config=] - A valid goblet config object or Repo Class instance
 *
 * @returns {string} - Path from the base directory
 */
const getPathFromConfig = (key, config) => {
  config = config || getGobletConfig(config)
  const baseDir = getRepoGobletDir(config)

  return config.paths[key]
    ? path.join(baseDir, config.paths[key])
    : path.join(baseDir, key)
}

module.exports = {
  getPathFromConfig,
}
