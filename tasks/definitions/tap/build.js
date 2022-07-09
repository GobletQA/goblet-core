const { sharedOptions } = require('@keg-hub/cli-utils')
const { buildBase } = require('../../utils/docker/buildBase')

/**
 * Starts all the Goblet services needed to run tests
 * @param {Object} args - arguments passed from the runTask method
 * @param {string} args.command - Root task name
 * @param {Object} args.tasks - All registered tasks of the CLI
 * @param {string} args.task - Task Definition of the task being run
 * @param {Array} args.options - arguments passed from the command line
 * @param {Object} args.globalConfig - Global config object for the keg-cli
 * @param {string} args.params - Passed in options, converted into an object
 * @param {Array} args.goblet - Local config, injected into the task args
 *
 * @returns {void}
 */
const buildGoblet = async args => {
  const { params } = args
  params.buildBase && await buildBase(args)

  return args.task.cliTask(args)
}

module.exports = {
  build: {
    name: 'build',
    alias: ['bld'],
    action: buildGoblet,
    example: 'test:build',
    mergeOptions: true,
    description: 'Builds the goblet docker images',
    options: sharedOptions(
      'build',
      {
        buildBase: {
          default: true,
          type: `boolean`,
          alias: [`base`],
          example: '--no-buildBase',
          description: 'Build the docker base image first',
        },
      },
      [
        `log`
      ]
    ),
  },
}
