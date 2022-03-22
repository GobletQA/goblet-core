const { getConfigAtPath } = require('HerkinSharedConfig')
const { getCurrentRepoPath } = require('./getCurrentRepoPath')

/**
 * Loads the herkin.config from the repos local/current path
 * Adds /current because gitfs mounts the repo content at /current
 *
 * @param {string} local - The local path to the mounted git repo
 *
 * @return {Object} - The loaded herkin.config object
 */
const loadHerkinConfig = async local => {
  const repoLoc = await getCurrentRepoPath(local)

  return getConfigAtPath(repoLoc)
}

module.exports = {
  loadHerkinConfig,
}
