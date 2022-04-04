const path = require('path')
const { throwErr } = require('./throwErr')
const { isObj } = require('@keg-hub/jsutils')
const { ensurePath } = require('./ensurePath')
const { getRepoPath } = require('./getRepoPath')

/**
 * Builds the arguments required for syncing a git repo
 * Expects the passed in objects to match the models from Herkin-Admin
 * @function
 * @throws
 *
 * @param {Object} args
 *
 * @returns {Object} - Built git args
 */
const configureGitArgs = async args => {
  const { repo, user, token } = args

  // Ensure the models were passed in
  !isObj(repo) && throwErr(`Missing repo object model`)
  !isObj(user) && throwErr(`Missing user object model`)

  const repoPath = getRepoPath(args)

  // Ensure the repo path exists, and if not then throw
  const pathExists = await ensurePath(repoPath)
  !pathExists && throwErr(`Repo directory could not be created`)

  return {
    local: repoPath,
    remote: repo.url,
    email: user.email,
    branch: repo.branch,
    username: user.gitUser,
    name: path.basename(repoPath),
    token: token || repo.token || user.token || process.env.HERKIN_GIT_TOKEN,
  }
}

module.exports = {
  configureGitArgs,
}