// TODO: update goblet core image to be built with-out the keg-cli
const { buildBase } = require('../../utils/docker/buildBase')
const { ensureArr, capitalize, uniqArr } = require('@keg-hub/jsutils')
const { sharedOptions, Logger } = require('@keg-hub/cli-utils')


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
  const { base, img, log } = args.params
  const toBuild = (!img || !img.length) ? [`base`, `core`] : uniqArr(ensureArr(img))
  const includeBase = base || (base !== false && toBuild.includes(`base`))
  const imgs = !includeBase && toBuild.includes(`base`)
    ? toBuild.filter(item => item !== `base`)
    : toBuild

  log &&
    Logger.pair(
      `Building docker images:`,
      imgs.map(name => `Goblet-${capitalize(name)}`).join(`, `)
    )

  includeBase && await buildBase(args)
  imgs.includes(`core`) && args.task.cliTask(args)

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
        img: {
          type: `array`,
          example: '--img base',
          default: [`base`, `core`],
          alias: [`image`, `images`],
          description: 'A comma separated list of images to build',
        },
        base: {
          default: true,
          type: `boolean`,
          example: '--no-base',
          description: 'Should the base image be built first. Overrides --img option',
        }
      },
      [`log`]
    ),
  },
}
