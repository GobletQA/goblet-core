const path = require('path')
const { loadConfigFromFolder } = require('HerkinSharedConfig')
const { getCurrentRepoPath } = require('./getCurrentRepoPath')

/**
 * Checks if a herkin.config exists in the mounted repo
 * Check for config in root | ./config | ./configs | ./herkin
 *
 * @param {string} local - The local path to the mounted git repo
 *
 * @return {string} - The found herkin.config path or false
 */
const checkHerkinConfig = async local => {
  const repoLoc = await getCurrentRepoPath(local)

  return loadConfigFromFolder(repoLoc)
}

module.exports = {
  checkHerkinConfig,
}
