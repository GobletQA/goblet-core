const path = require('path')
const { getRepoHerkinDir } = require('./getRepoHerkinDir')

/**
 * First gets the baseDir
 * Next, gets a full path from that base dir
 * @param {string} loc - The path within the base to get
 * @param {Object} config - A valid herkin config object or Repo Class instance
 *
 * @returns {string} - Path from the base directory
 */
const getPathFromBase = (loc, config) => {
  const baseDir = getRepoHerkinDir(config)

  return path.join(baseDir, loc)
}

module.exports = {
  getPathFromBase,
}
