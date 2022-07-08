const { throwErr } = require('../utils/throwErr')
const { MOUNT_LOG } = require('../constants')
const { runCmd } = require('@keg-hub/cli-utils')
const { isObj, limbo, deepMerge, exists } = require('@keg-hub/jsutils')

/**
 * Default child process options
 * @type {Object}
 */
const defCmdOpts = {
  // exec: true
}

/**
 * Default options for calls to gitfs
 * @type {Object}
 */
const defGitArgs = [
  `debug=true`,
  // `foreground=true`,
  // `log=syslog`,
  // `fetch_timeout=20`,
]

/**
 * Options object passed to the gitfs executable
 * @typedef {Object} gitOpts
 * @property {string} remote - The git remote repo url to be mounted
 * @property {string} local - The local path when the git remote should be mounted
 * @property {string} username - The git provider username
 * @property {string} name - The git user to use for git commits
 * @property {string} email - The git user email to use for git commits
 * @property {string} token - The git provider token that has access to the repo
 * @property {string} log - Path on the host file system to output logs
 */

/**
 * All allowed options to pass to gitfs
 * @type {Object}
 * @example
 * python3 -m gitfs -o user=www-data,group=www-data,password=boo_password,log=/var/log/gitfs.log,debug=true,foreground=true,commiter_name=user,commiter_email=user@whatever.com,username=user "https://github.com/user/project.git" "/path/to/local/folder"
 *
 */
const allowedGitfsOpts = [
  `log`,
  `branch`,
  `username`,
  `password`,
  `commiter_name`,
  `commiter_email`,
]

/**
 * Builds the options for GitFS
 * @param {gitOpts} gitOpts - properties to build options for the gitfs call
 *
 * @returns {string} - Built gitFs options string
 */
const buildGitOpts = options => {
  let built = Object.entries(options)
    .reduce((acc, [key, value]) => {
      // Ensure the option is allowed
      // Then add to the options array
      allowedGitfsOpts.includes(key) && acc.push(`${key}=${value}`)

      return acc
    }, defGitArgs)
    .join(`,`)

  // Ensure we save the logs somewhere for debugging
  if (!built.includes(`log=`)) built = `log=${MOUNT_LOG},${built}`

  // Ensure the git token is added if it exists
  if (!built.includes(`password=`) && process.env.GOBLET_GIT_TOKEN)
    built = `password=${process.env.GOBLET_GIT_TOKEN},${built}`

  return built
}

/**
 * Validates the gitOpts object has the correct properties
 * @function
 * @throws
 * @param {gitOpts} gitOpts - properties to build options for the gitfs call
 *
 * @returns {Void}
 */
const validateGitOpts = gitOpts => {
  // Ensure an object is passed
  !isObj(gitOpts) &&
    throwErr(`GitFS requires an options object. Received ${typeof gitOpts}`)
  ;['local', 'remote', 'branch', 'username'].map(key => {
    !gitOpts[key] &&
      throwErr(
        `GitFS requires a ${key} property and value in the git options object`
      )
  })

  !gitOpts.token &&
    !exists(process.env.GOBLET_GIT_TOKEN) &&
    throwErr(
      `GitFS requires a valid token property. Or set the GOBLET_GIT_TOKEN env`
    )

  return {
    local: gitOpts.local,
    remote: gitOpts.remote,
    branch: gitOpts.branch,
    username: gitOpts.username,
    commiter_name: gitOpts.name || gitOpts.username,
    password: gitOpts.token || process.env.GOBLET_GIT_TOKEN,
    commiter_email: gitOpts.email || `${gitOpts.username}@goblet.io`,
  }
}

/**
 * Converts the passed in gitOpts into a gitfs options string matching GitFS command requirements
 * @function
 * @param {gitOpts} gitOpts - properties to build options for the gitfs call
 *
 * @returns {Array} - Args to pass to the child process
 */
const buildOptsArr = ({ remote, local, ...options }) => {
  return ['-m', 'gitfs', `-o`, buildGitOpts(options), remote, local]
}

/**
 * Calls gitfs in a subshell after building the options from the passed in args
 * @function
 * @param {gitOpts} gitOpts - properties to build options for the gitfs call
 * @param {Object} cmdOpts - Options to pass to the child sub process
 *
 * @returns {}
 */
const gitfs = async (gitOpts, cmdOpts) => {
  const options = validateGitOpts(gitOpts)
  const builtOpts = buildOptsArr(options)

  return await limbo(
    runCmd('python3', builtOpts, deepMerge(defCmdOpts, cmdOpts))
  )
}

module.exports = {
  gitfs,
}
