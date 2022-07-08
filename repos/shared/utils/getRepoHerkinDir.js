const path = require('path')
const { getGobletConfig } = require('./getGobletConfig')

/**
 * Helper to find the base directory all the other repo paths are relative to
 * Joins the repoRoot and workDir together is workDir exists
 * Otherwise returns repoRoot
 * @param {Object} config - A valid herkin config object or Repo Class instance
 *
 * @returns {string} - Path to the herkin directory in a repo
 */
const getRepoHerkinDir = config => {
  config =
    config && config.__VALID_GOBLET_CONFIG ? config : getGobletConfig(config)
  const { repoRoot, workDir } = config.paths

  return workDir ? path.join(repoRoot, workDir) : repoRoot
}

module.exports = {
  getRepoHerkinDir,
}
