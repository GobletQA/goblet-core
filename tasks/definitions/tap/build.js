const { deepMerge } = require('@keg-hub/jsutils')
const { sharedOptions } = require('@keg-hub/cli-utils')

/**
 * Builds the Keg-Herkin docker image
 * @param {Object} args - arguments passed from the runTask method
 * @param {string} args.command - Root task name
 * @param {Object} args.tasks - All registered tasks of the CLI
 * @param {string} args.task - Task Definition of the task being run
 * @param {Array} args.options - arguments passed from the command line
 * @param {Object} args.globalConfig - Global config object for the keg-cli
 * @param {string} args.params - Passed in options, converted into an object
 * @param {Array} args.herkin - Local config, injected into the task args
 *
 * @returns {void}
 */
const buildHerkin = async (args) => {
  return await args.task.cliTask(args)
}

module.exports = {
  build: {
    name: 'build',
    alias: ['bld'],
    action: buildHerkin,
    example: 'keg herkin build',
    // Merge the default task options with these custom task options
    mergeOptions: true,
    description : 'Build the Keg-Herkin docker image from the host machines repo',
    options: {}
  }
}
