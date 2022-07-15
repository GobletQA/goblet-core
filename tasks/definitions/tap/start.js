const nodePath = require('path')
const { get } = require('@keg-hub/jsutils')
const { sharedOptions } = require('@keg-hub/cli-utils')
const { validateConfig } = require('@GTasks/utils/validation')
const { setMountEnvs } = require('@GTasks/utils/envs/setMountEnvs')
const { setGobletMode } = require('@GTasks/utils/helpers/setGobletMode')
const {
  launchBrowsers,
} = require('@GTasks/utils/playwright/launchBrowsers')

/**
 * @param {String} configPath - path to goblet config file
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
 * @param {Array} args.goblet - Local config, injected into the task args
 *
 * @returns {void}
 */
const startGoblet = async args => {
  const { goblet } = args
  validateConfig(goblet)

  const {
    mode,
    local,
    vnc,
    launch,
    config,
    // All params not related to the goblet start cmd
    ...params
  } = args.params

  const gobletMode = setGobletMode(args.params)
  gobletMode === 'local' && (await launchBrowsers(args.params, gobletMode))

  gobletMode !== 'vnc' &&
    setMountEnvs(goblet, {
      path: getRootPath(goblet) || process.cwd(),
      env: params.env,
    })

  return args.task.cliTask(args)
}

module.exports = {
  start: {
    name: 'start',
    alias: ['st'],
    action: startGoblet,
    example: 'test:start',
    // Merge the default task options with these custom task options
    mergeOptions: true,
    description: 'Starts all services. (Local Webserver and Docker Container)',
    options: sharedOptions(
      'start',
      {
        config: {
          description:
            'Path to the user goblet.config.js. If omitted, goblet will look in your current working directory for a goblet config.',
          example: 'keg goblet start --config my-repo/goblet.config.js',
        },
        warn: {
          alias: ['warn'],
          description:
            'See additional warnings (like for a missing goblet config)',
          example:
            'keg goblet start --config my-repo/goblet.config.js --no-warn',
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
