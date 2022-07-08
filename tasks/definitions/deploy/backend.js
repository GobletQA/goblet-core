const { Logger } = require('@keg-hub/cli-utils')
const { sharedOptions } = require('../../utils/task/sharedOptions')
const { deployBackend } = require('../../utils/deploy/deployBackend')


/**
  * Deploys Herkin backend to gcloud
 * @param {Object} args - arguments passed from the runTask method
 * @param {string} args.command - Root task name
 * @param {Object} args.tasks - All registered tasks of the CLI
 * @param {string} args.task - Task Definition of the task being run
 * @param {Array} args.options - arguments passed from the command line
 * @param {Object} args.globalConfig - Global config object for the keg-cli
 * @param {string} args.params - Passed in options, converted into an object
 *
 * @returns {void}
 */
const backendDeploy = async args => {
  await deployBackend(args)
}

module.exports = {
  backend: {
    name: 'backend',
    alias: ['be'],
    inject: true,
    action: backendDeploy,
    example: 'keg herkin deploy backend <options>',
    description: 'Run Goblet deploy backend tasks',
    options: {
      ...sharedOptions.deploy(`deploy`, `backend`),
      ...sharedOptions.version(`deploy`, `backend`),
      build: {
        type: 'bool',
        default: true,
        env: `GOBLET_DEPLOY_BUILD_IMG`,
        example: 'keg herkin deploy build --no-build',
        description: 'Build the docker image before pushing',
      },
      envs: {
        type: 'array',
        alias: ['envs'],
        env: `GOBLET_DEPLOY_BUILD_ENVS`,
        example: 'keg herkin deploy build --envs EXTRA=env-value,ANOTHER=env-value-2',
        description: 'Comma separated list of extra envs to app on to the build process',
      },
      tags: {
        type: 'array',
        alias: [`tag`, `tg`],
        env: `GOBLET_DEPLOY_BUILD_TAGS`,
        example: 'keg herkin deploy build --tag backend-app',
        description: 'Custom tags for the built docker images',
      },
    },
  },
}
