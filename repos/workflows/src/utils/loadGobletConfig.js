const { getConfigAtPath } = require('@GSH/Config')
const { getCurrentRepoPath } = require('./getCurrentRepoPath')

/**
 * Loads the goblet.config from the repos local/current path
 * Adds /current because gitfs mounts the repo content at /current
 *
 * @param {string} local - The local path to the mounted git repo
 *
 * @return {Object} - The loaded goblet.config object
 */
const loadGobletConfig = async local => {
  const repoLoc = await getCurrentRepoPath(local)

  return getConfigAtPath(repoLoc)
}

module.exports = {
  loadGobletConfig,
}
