const { metadata } = require('HerkinSC')
const { fileSys, Logger } = require('@keg-hub/cli-utils')
const { pathExistsSync, readFile } = fileSys


/**
 * Print the browser metadata if it exists
 * @param {Object} args - arguments passed from the runTask method
 * @param {string} args.command - Initial command being run
 * @param {Array} args.options - arguments passed from the command line
 * @param {Object} args.tasks - All registered tasks of the CLI
 * @param {Object} globalConfig - Global config object for the keg-cli
 *
 * @returns {void}
 */
const printMeta = async (args) => {
  const { params } = args

  Logger.empty()
  if(!pathExistsSync(metadata.location))
    return Logger.pair(`Browser metadata file does not exist at:`, `${metadata.location}\n`)

  const [err, content] = await readFile(metadata.location)
  err ? Logger.error(err) : Logger.log(content)
  Logger.empty()
}

module.exports = {
  print: {
    name: 'print',
    alias: [ 'prt', `pr` ],
    action: printMeta,
    example: 'keg herkin metadata print',
    description : 'Print the browser metadata if it exists',
  }
}
