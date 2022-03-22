const path = require('path')
const { throwErr } = require('../utils/throwErr')
const { limbo, isEmpty } = require('@keg-hub/jsutils')
const { getRepoPath } = require('../utils/getRepoPath')
const { fileSys, Logger, runCmd } = require('@keg-hub/cli-utils')

/**
 * Manually checks the file system to see if a repo is mount
 * @function
 * @public
 * @throws
 *
 * @param {string} repoPath - Path to the folder that should be checked
 *
 * @returns {boolean} - true if the repo is mounted
 */
const mountedFallback = async repoPath => {
  Logger.log(`Falling back to check folder path...`)

  const fullPath = path.join(repoPath, `current`)
  const [err, pathExists] = await fileSys.pathExists(fullPath)

  err && err.code !== `ENOENT` && throwErr(err)

  return Boolean(pathExists)
}

/**
 * Checks if the passed in path is a fuse mount directory
 * @function
 * @public
 * @throws
 * @example
 * stat --file-system --format=%T <path/to/repo>
 *
 * @param {Object} args
 * @param {Object} args.user - User model object
 * @param {string} args.user.gitUser - Name of the user
 * @param {string} localPath - Already known path to a repo location
 *
 * @returns {boolean} - true if the repo is mounted
 */
const isRepoMounted = async (args, localPath) => {
  const repoPath = localPath || getRepoPath(args)

  Logger.log(`Checking if repo is mounted at ${repoPath}`)
  const [err, { error, data, exitCode }] = await limbo(
    runCmd(`stat`, [`--file-system`, `--format=%T`, repoPath], { exec: true })
  )

  error && !error.includes(`No such file or directory`) && throwErr(error)

  // If the stat command fails, but no error is given
  // Fallback to manually checking the filesystem
  return exitCode && isEmpty(data)
    ? await mountedFallback(repoPath)
    : data.trim() === 'fuseblk'
}

module.exports = {
  isRepoMounted,
}
