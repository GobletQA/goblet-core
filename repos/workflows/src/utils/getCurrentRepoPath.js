const path = require('path')

/**
 * Checks if the current folder exists in the repo path
 * gitfs stores the mounted repo within the current folder
 * So we need to check if it exists to get the true repo location
 *
 * @param {string} local - The local path to the mounted git repo
 *
 * @return {string} - The path to the mounted repo content
 */
const getCurrentRepoPath = async local => {
  const withCurrent =
    path.basename(local) === 'current' ? local : path.join(local, 'current')
  return withCurrent
}

module.exports = {
  getCurrentRepoPath,
}
