const path = require('path')
const { appRoot } = require('../../paths')
const { addFlag } = require('@keg-hub/cli-utils')
const { uniqArr, noPropArr } = require('@keg-hub/jsutils')
/**
 * Builds the arguments that are passed to jest when the test is run
 * @param {Object} params - Parsed task definition options
 *                          See options section of the task definition below
 * @param {string} jestConfig - Path the a jest config file to load
 */
const buildJestArgs = (params, jestConfig, extraArgs=noPropArr) => {
  const { timeout, bail, context, noTests } = params

  const cmdArgs = [
    // 'npx',
    // 'jest',
    path.join(appRoot, 'node_modules/.bin/jest'),
    ...extraArgs,
    '--detectOpenHandles',
    '--no-cache',
    // Convert to milliseconds
    `--testTimeout=${(timeout || 90) * 1000}`,
  ]

  cmdArgs.push(addFlag('bail', bail))
  cmdArgs.push(addFlag('passWithNoTests', noTests))
  cmdArgs.push(addFlag(`config=${jestConfig}`, jestConfig))

  // If context is set use that as the only file to run
  context && cmdArgs.push(context)

  return uniqArr(cmdArgs.filter(arg => arg))
}

module.exports = {
  buildJestArgs,
}
