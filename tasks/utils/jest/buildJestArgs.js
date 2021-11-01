const path = require('path')
const { appRoot } = require('../../paths')
const { get } = require('@keg-hub/jsutils')

/**
 * Builds the arguments that are passed to jest when the test is run
 * @param {Object} params - Parsed task definition options
 *                          See options section of the task definition below
 * @param {Object} herkin - Keg-Herkin global config object
 */
const buildJestArgs = (params, herkin) => {
  const { jestConfig, timeout, bail, context, filter, noTests } = params

  const cmdArgs = [
    'npx',
    'jest',
    '--detectOpenHandles',
    '--no-cache',
    '--runInBand',
    // TODO: fix this timeout
    // Convert to milliseconds
    // `--testTimeout=${(timeout || 90) * 1000}`
    `--testTimeout=10000`
  ]

  bail && cmdArgs.push('--bail')
  noTests && cmdArgs.push('--passWithNoTests')

  const rootDir = get(herkin, `paths.rootDir`, appRoot)
  jestConfig && cmdArgs.push(`--config=${path.join(rootDir, jestConfig)}`)

  // If context is set use that as the only file to run
  context && cmdArgs.push(context)

  return cmdArgs
}

module.exports = {
  buildJestArgs
}