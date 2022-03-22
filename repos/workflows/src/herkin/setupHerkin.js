const { Logger } = require('@keg-hub/cli-utils')
const { omitKeys } = require('@keg-hub/jsutils')
const { loadToken } = require('../utils/loadToken')
const { failResp, successResp } = require('./response')
const { getRepoName } = require('../utils/getRepoName')
const { copyTemplate } = require('../utils/copyTemplate')
const { isRepoMounted } = require('../gitfs/isRepoMounted')
const { loadHerkinConfig } = require('../utils/loadHerkinConfig')
const { configureGitArgs } = require('../utils/configureGitArgs')

/**
 * Workflow that creates the folder structure for keg-herkin (templates/repo/default-template)
 * @function
 * @public
 * @throws
 * @param {Object} args - Data needed to execute the workflow
 * @param {Object} args.repo - Repo metadata for setting up keg-herkin
 */
const setupHerkin = async (args, gitArgs, mounted) => {
  Logger.subHeader(`Running Setup Herkin Workflow`)

  const token = (gitArgs && gitArgs.token) || (await loadToken(args))
  gitArgs = gitArgs || (await configureGitArgs({ ...args, token }))
  const git = omitKeys(gitArgs, ['email', 'token'])

  const isMounted = mounted || (await isRepoMounted(args))
  if (!isMounted)
    return failResp({ setup: false }, `Repo ${gitArgs.remote} is not connected`)

  Logger.log(`Checking herkin configuration...`)
  const hasHerkin = await copyTemplate(gitArgs.local, args.repoTemplate)
  if (!hasHerkin)
    return failResp(
      { setup: false },
      `Herkin template could not be created for repo ${gitArgs.remote}`
    )

  Logger.log(`Loading herkin.config...`)
  const herkinConfig = await loadHerkinConfig(gitArgs.local)

  return herkinConfig
    ? successResp(
        { setup: true },
        {
          repo: {
            ...herkinConfig,
            name: getRepoName(gitArgs.remote),
            git,
          },
        },
        `Finished running Setup Herkin Workflow`
      )
    : failResp(
        { setup: false },
        `Could not load herkin.config for mounted repo`
      )
}

module.exports = {
  setupHerkin,
}
