const { Logger } = require('@keg-hub/cli-utils')
const metadata = require('@GSC/Playwright/helpers/metadata')

/**
 * Print the browser metadata path on the HDD
 * @param {Object} args - arguments passed from the runTask method
 * @param {string} args.command - Initial command being run
 * @param {Array} args.options - arguments passed from the command line
 * @param {Object} args.tasks - All registered tasks of the CLI
 * @param {Object} globalConfig - Global config object for the keg-cli
 *
 * @returns {void}
 */
const metaLocation = async args => {
  const metaLoc = metadata.location()
  Logger.log(metaLoc)

  return metaLoc
}

module.exports = {
  path: {
    name: 'path',
    alias: ['location', 'loc'],
    action: metaLocation,
    example: 'keg goblet metadata path',
    description: 'Print the path to the browser metadata',
  },
}
