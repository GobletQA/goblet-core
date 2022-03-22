// docker run -d -p 80:8080 keg herkin deployapi/keg herkin deploy-editor

const { docker } = require('../../utils/docker')
const { addFlag, addParam } = require('@keg-hub/cli-utils')

const getEnvVal = (env, def) => {
  return process.env[env] || def
}

/**
 * Starts the docker keg herkin deploy container
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
      getEnvVal('HERKIN_DEPLOY_IMG', 'keg-herkin:prod'),
    ],
    { envFile, env }
  )
}

module.exports = {
  run: {
    name: 'run',
    alias: ['st', 'up'],
    action: run,
    example: 'keg herkin deploy run -- <options>',
    description: 'Starts docker-docker db containers',
    options: {
      detach: {
        alias: ['daemon'],
        example: 'keg herkin deploy run -- detach=false',
        description: 'Start the db containers in the background',
        type: 'boolean',
        default: true,
      },
      envFile: {
        alias: ['envs', 'values', 'val', 'valuesFile'],
        example: 'keg herkin deploy run -- envs=<path/to/envs(.env | .yml)>',
        description:
          'Path to an .env or .yml file to load environment variables',
      },
      port: {
        example: 'keg herkin deploy run -- port=7070',
        description: 'Port to expose the keg herkin deploy editor',
        default: '7070',
      },
      name: {
        example: 'keg herkin deploy run -- name=custom-name',
        description: 'Name of the keg herkin deploy editor docker container',
        default: 'herkin-prod',
      },
    },
  },
}
