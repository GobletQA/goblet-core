// docker run -d -p 80:8080 keg goblet deployapi/keg goblet deploy-editor

const { docker } = require('../../utils/docker')
const { addFlag, addParam } = require('@keg-hub/cli-utils')

const getEnvVal = (env, def) => {
  return process.env[env] || def
}

/**
 * Starts the docker keg goblet deploy container
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
const run = async ({ params }) => {
  const { env, envFile, detach, name, port } = params

  return docker.run(
    [
      addFlag('detach', detach),
      addFlag('it', !detach).replace('--', '-'),
      addParam(`p`, `${port}:80`).replace('--', '-'),
      addParam(`name`, name),
      getEnvVal('GOBLET_DEPLOY_IMG', 'goblet:prod'),
    ],
    { envFile, env }
  )
}

module.exports = {
  run: {
    name: 'run',
    alias: ['st', 'up'],
    action: run,
    example: 'keg goblet deploy run -- <options>',
    description: 'Starts docker-docker db containers',
    options: {
      detach: {
        alias: ['daemon'],
        example: 'keg goblet deploy run -- detach=false',
        description: 'Start the db containers in the background',
        type: 'boolean',
        default: true,
      },
      envFile: {
        alias: ['envs', 'values', 'val', 'valuesFile'],
        example: 'keg goblet deploy run -- envs=<path/to/envs(.env | .yml)>',
        description:
          'Path to an .env or .yml file to load environment variables',
      },
      port: {
        example: 'keg goblet deploy run -- port=7070',
        description: 'Port to expose the keg goblet deploy editor',
        default: '7070',
      },
      name: {
        example: 'keg goblet deploy run -- name=custom-name',
        description: 'Name of the keg goblet deploy editor docker container',
        default: 'goblet-prod',
      },
    },
  },
}
