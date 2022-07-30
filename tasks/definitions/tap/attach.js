const { sharedOptions } = require('@keg-hub/cli-utils')
const { setGobletMode } = require('@GTasks/utils/helpers/setGobletMode')
const {
  launchBrowsers,
} = require('@GTasks/utils/playwright/launchBrowsers')

/**
 * Attach to the running keg-tap container
 * @param {Object} args - arguments passed from the runTask method
 * @param {string} args.command - Initial command being run
 * @param {Array} args.options - arguments passed from the command line
 * @param {Object} args.tasks - All registered tasks of the CLI
 * @param {Object} globalConfig - Global config object for the keg-cli
 *
 * @returns {void}
 */
const attachGoblet = async args => {
  const { params } = args

  // TODO: Pull in the docker container information via inspect
  // Check the arguments used to run the contianer
  // If it has the GB_PW_SOCKET_ACTIVE env, Run in local mode
  // If it has the GB_VNC_ACTIVE env, run in vnc mode
  // Then pass that mode to the setGobletMode and launchBrowsers methods
  // This ensures it's consistent with the original run
  // Or investigate adding it to the browser metadata?

  // const gobletMode = setGobletMode(params)
  // await launchBrowsers(params, gobletMode)

  return await args.task.cliTask(args)
}

module.exports = {
  attach: {
    name: 'attach',
    alias: ['att'],
    action: attachGoblet,
    example: 'keg goblet attach',
    description: 'Attach to the running tap container',
    // Merge the default task options with these custom task options
    mergeOptions: true,
    options: sharedOptions(
      'start',
      {
        launch: {
          description:
            'Launch a playwright websocket to allow remote connections to the browser.\nNot valid in headless mode.',
          example: 'attach --launch',
          default: false,
        },
      },
      [
        'headless',
        'log',
        'base',
        'allBrowsers',
        'chromium',
        'firefox',
        'webkit',
        'mode',
      ]
    ),
  },
}
