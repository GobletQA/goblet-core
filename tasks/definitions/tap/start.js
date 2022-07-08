const nodePath = require('path')
const { get } = require('@keg-hub/jsutils')
const { sharedOptions } = require('@keg-hub/cli-utils')
const { validateConfig } = require('GobletTasks/utils/validation')
const { setMountEnvs } = require('GobletTasks/utils/envs/setMountEnvs')
const { setGobletMode } = require('GobletTasks/utils/helpers/setGobletMode')
const {
  launchBrowsers,
} = require('GobletTasks/utils/playwright/launchBrowsers')

/**
 * @param {String} configPath - path to herkin config file
 * @returns {String} path without config file
 */
const getRootPath = config =>
  nodePath.resolve(get(config, ['internalPaths', 'gobletRoot']))

/**
 * Starts all the Goblet services needed to run tests
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
const startHerkin = async args => {
  const { herkin } = args
  validateConfig(herkin)

  const {
    mode,
    local,
    vnc,
    launch,
    config,
    // All params not related to the goblet start cmd
    ...params
  } = args.params

  const herkinMode = setGobletMode(args.params)
  herkinMode === 'local' && (await launchBrowsers(args.params, herkinMode))

  herkinMode !== 'vnc' &&
    setMountEnvs(herkin, {
      path: getRootPath(herkin) || process.cwd(),
      env: params.env,
    })

  return args.task.cliTask(args)
}

module.exports = {
  start: {
    name: 'start',
    alias: ['st'],
    action: startHerkin,
    example: 'test:start',
    // Merge the default task options with these custom task options
    mergeOptions: true,
    description: 'Starts all services. (Local Webserver and Docker Container)',
    options: sharedOptions(
      'start',
      {
        config: {
          description:
            'Path to the user goblet.config.js. If omitted, goblet will look in your current working directory for a herkin config.',
          example: 'keg herkin start --config my-repo/goblet.config.js',
        },
        warn: {
          alias: ['warn'],
          description:
            'See additional warnings (like for a missing herkin config)',
          example:
            'keg herkin start --config my-repo/goblet.config.js --no-warn',
          default: true,
        },
        launch: {
          description:
            'Launch a playwright websocket to allow remote connections to the browser.\nNot valid in headless mode.',
          example: 'start --launch',
        },
        mode: {
          allowed: ['vnc', 'local'],
          example: 'start --mode local',
          description:
            'Mode to run goblet in. In not set, uses launch option',
        },
        local: {
          allowed: ['lc'],
          example: 'start --local',
          description: `Run goblet in local mode. Same as '--mode local' option`,
        },
        vnc: {
          example: 'start --vnc',
          description: `Run goblet in vnc mode. Same as '--mode vnc' option`,
        },
      },
      [
        'headless',
        'log',
        'mode',
        'local',
        'vnc',
        'base',
        'browsers',
        'allBrowsers',
        'chromium',
        'firefox',
        'webkit',
      ]
    ),
  },
}
