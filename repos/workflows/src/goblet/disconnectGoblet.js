const { Logger } = require('@keg-hub/cli-utils')
const { getRepoPath } = require('../utils/getRepoPath')
const { isRepoMounted } = require('../gitfs/isRepoMounted')
const { fuseUnmount } = require('../gitfs/fuseUnmount')

/**
 * Workflow to unmount a repo based on a users name
 * @function
 * @public
 * @throws
 * @example
 *
 * @param {Object} args
 * @param {Object} args.user - User model object
 * @param {string} args.user.gitUser - Name of the user
 *
 * @returns {Object} - Mount state of the repo
 */
const disconnectGoblet = async args => {
  const mounted = await isRepoMounted(args)

  mounted
    ? await fuseUnmount(args)
    : Logger.warn(`[ WARNING ] Repo is not mounted`)

  return {
    unmounted: true,
    mountPath: getRepoPath(args),
    user: args?.user?.gitUser,
  }
}

module.exports = {
  disconnectGoblet
}
