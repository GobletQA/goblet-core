// Command => `keg goblet deploy fe --env prod`

const { Logger } = require('@keg-hub/cli-utils')
const { sharedOptions } = require('../../utils/task/sharedOptions')
const { deployFrontend } = require('../../utils/deploy/deployFrontend')

/**
 * Deploys Goblet frontend to firebase hosting
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
const frontendDeploy = async args => {
  const { log } = args.params
  const exitCode = await deployFrontend(args)
  
  if(exitCode)
    throw new Error(`Error deploying Goblet frontend to firebase. Exit Code: ${exitCode}`)

  log && Logger.success(`\n[Success] ${Logger.colors.white('Frontend deployed to firebase')}\n`)
}

module.exports = {
  frontend: {
    name: 'frontend',
    alias: ['fe'],
    inject: true,
    action: frontendDeploy,
    example: 'keg goblet deploy frontend <options>',
    description: 'Run Goblet deploy frontend tasks',
    options: {
      ...sharedOptions.version(`deploy`, `frontend`),
      mode: {
        allowed: ['vnc', 'local'],
        example: `keg goblet deploy --mode local`,
        default: 'vnc',
        description: 'Mode to run goblet in. In not set, uses launch option',
      },
      vnc: {
        example: `keg goblet deploy --vnc`,
        default: true,
        description: `Build goblet in vnc mode. Same as '--mode vnc' option`,
      },
      log: {
        alias: ['lg'],
        description: 'Log task output',
        type: 'bool',
        default: true,
        example: '--no-log',
      },
      tokenFile: {
        alias: ['tf'],
        example: 'keg goblet deploy frontend --tokenFile /cutom/token/file',
        description: 'Path to a file that contains a firebase token',
      },
      token: {
        example: 'keg goblet deploy frontend --token <firebase deploy token>',
        description: 'Firebase deploy token',
      },
    },
  },
}
