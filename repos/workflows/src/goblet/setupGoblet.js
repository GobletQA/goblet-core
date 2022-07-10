const { Logger } = require('@keg-hub/cli-utils')
const { omitKeys } = require('@keg-hub/jsutils')
const { loadToken } = require('../utils/loadToken')
const { failResp, successResp } = require('./response')
const { getRepoName } = require('../utils/getRepoName')
const { copyTemplate } = require('../utils/copyTemplate')
const { isRepoMounted } = require('../gitfs/isRepoMounted')
const { loadGobletConfig } = require('../utils/loadGobletConfig')
const { configureGitArgs } = require('../utils/configureGitArgs')

/**
 * Workflow that creates the folder structure for goblet (templates/repo/default-template)
 * @function
 * @public
 * @throws
 * @param {Object} args - Data needed to execute the workflow
 * @param {Object} args.repo - Repo metadata for setting up goblet
 */
const setupGoblet = async (args, gitArgs, mounted) => {
  Logger.subHeader(`Running Setup Goblet Workflow`)

  const token = (gitArgs && gitArgs.token) || (await loadToken(args))
  gitArgs = gitArgs || (await configureGitArgs({ ...args, token }))
  const git = omitKeys(gitArgs, ['email', 'token'])

  const isMounted = mounted || (await isRepoMounted(args))
  if (!isMounted)
    return failResp({ setup: false }, `Repo ${gitArgs.remote} is not connected`)

  Logger.log(`Checking goblet configuration...`)
  const hasGoblet = await copyTemplate(gitArgs.local, args.repoTemplate)
  if (!hasGoblet)
    return failResp(
      { setup: false },
      `Goblet template could not be created for repo ${gitArgs.remote}`
    )

  Logger.log(`Loading goblet.config...`)
  const gobletConfig = await loadGobletConfig(gitArgs.local)

  return gobletConfig
    ? successResp(
        { setup: true },
        {
          repo: {
            ...gobletConfig,
            name: getRepoName(gitArgs.remote),
            git,
          },
        },
        `Finished running Setup Goblet Workflow`
      )
    : failResp(
        { setup: false },
        `Could not load goblet.config for mounted repo`
      )
}

module.exports = {
  setupGoblet,
}
