const { Logger } = require('@keg-hub/cli-utils')
const { setupHerkin } = require('./setupHerkin')
const { loadToken } = require('../utils/loadToken')
const { mountRepo } = require('../repo/mountRepo')
const { branchRepo } = require('../repo/branchRepo')
const { failResp } = require('./response')
const { isRepoMounted } = require('../gitfs/isRepoMounted')
const { configureGitArgs } = require('../utils/configureGitArgs')

/**
 * Workflow for initializing keg-herkin within a git repo
 * Steps
 *  1. Clones down a repo from a git provider (/repo/mountRepo)
 *  2. Creates a new branch from the default branch (/repo/branchRepo)
 *  3. Sets up keg-herkin config and folder structure (/herkin/setupHerkin)
 *  4. Commits the changes to the repo (/repo/commitRepo)
 *  5. Pushes the branch with the changes to the git provider (/repo/pushRepo)
 * @function
 * @public
 * @throws
 * @param {Object} args - Data needed to execute the workflow
 * @param {Object} args.user - User metadata of the user currently logged in
 * @param {Object} args.repo - Repo metadata for setting up keg-herkin
 */
const initializeHerkin = async args => {
  Logger.subHeader(`Running Initialize Herkin Workflow`)
  const token = await loadToken(args)
  const gitArgs = await configureGitArgs({ ...args, token })

  if (token === false)
    return failResp(
      { setup: false, mounted: false, status: 'unknown' },
      'Failed repo mount. Improper git validation'
    )

  // Ensure the repo is not already mounted before trying to mount it
  const mounted = await isRepoMounted(args)
  if (mounted) {
    Logger.log(`Repo is already mounted at ${gitArgs.local}`)

    return await setupHerkin(args, gitArgs, true)
  }

  Logger.log(`Creating new branch...`)
  const branch = await branchRepo(gitArgs)

  Logger.log(`Mounting remote repo...`)
  await mountRepo({ ...gitArgs, branch })

  Logger.log(`Setting up Keg-Herkin...`)
  const setupResp = await setupHerkin(args, gitArgs)

  setupResp.mounted && setupResp.setup
    ? Logger.success(`Finished running Initialize Herkin Workflow`)
    : Logger.error(
        Logger.colors.red(`Failed Initialize Herkin Workflow\n`),
        Logger.colors.white(`\t- Repo Mount: ${setupResp.mounted}\n`),
        Logger.colors.white(`\t- Repo Setup: ${setupResp.setup}\n`)
      )

  return setupResp
}

module.exports = {
  initializeHerkin,
}
