const path = require('path')
const { sharedOptions } = require('@keg-hub/cli-utils')

/**
 * Run unit tests in container
 * @param {Object} args
 */
const runUnit = async args => {
  console.log(`---------- TODO: run unit tests ----------`)
  console.log(args.params)
}

module.exports = {
  run: {
    name: 'run',
    alias: ['test'],
    action: runUnit,
    example: 'keg herkin unit run',
    description : 'Runs unit feature tests',
    // TODO: Update to allow groupNames to be be array in cli-utils/tasks/sharedOptions
    options: sharedOptions('run', {
      jestConfig: {
        default: 'configs/configs/jest.config.js'
      },
    }, [
      'jestConfig',
    ])
  }
}
