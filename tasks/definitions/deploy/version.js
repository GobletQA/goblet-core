const { sharedOptions } = require('../../utils/task/sharedOptions')
const { updateVersion } = require('../../utils/deploy/updateVersion')

/**
 * Updates the version of keg-herkin
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
const version = async ({ params }) => {
  return await updateVersion(params.version, params.confirm, params.log)
}

module.exports = {
  version: {
    name: 'version',
    alias: ['ver'],
    action: version,
    example: 'keg herkin deploy version <options>',
    description: 'Starts docker-docker db containers',
    options: {
      ...sharedOptions.version(`deploy`, `version`),
    },
  },
}
