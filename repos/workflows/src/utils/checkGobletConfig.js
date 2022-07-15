const path = require('path')
const { loadConfigFromFolder } = require('@GSH/Config')
const { getCurrentRepoPath } = require('./getCurrentRepoPath')

/**
 * Checks if a goblet.config exists in the mounted repo
 * Check for config in root | ./config | ./configs | ./goblet
 *
 * @param {string} local - The local path to the mounted git repo
 *
 * @return {string} - The found goblet.config path or false
 */
const checkGobletConfig = async local => {
  const repoLoc = await getCurrentRepoPath(local)

  return loadConfigFromFolder(repoLoc)
}

module.exports = {
  checkGobletConfig,
}
