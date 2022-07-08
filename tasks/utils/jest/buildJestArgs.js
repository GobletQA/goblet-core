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
  const {
    context,
    noTests,
    testCI,
    testBail,
    testSync,
    testDebug,
    testCache,
    testColors,
    testVerbose,
    testWorkers,
    testTimeout,
    testOpenHandles,
  } = params

  const cmdArgs = [
    path.join(appRoot, `node_modules/.bin/jest`),
    ...extraArgs,
    `--env=node`,
    // Convert to milliseconds
    `--testTimeout=${(parseInt(testTimeout, 10) || 30000)}`,
  ]

  cmdArgs.push(addFlag(`ci`, testCI))
  cmdArgs.push(addFlag(`colors`, testColors))
  cmdArgs.push(addFlag(`verbose`, testVerbose))
  cmdArgs.push(addFlag(`maxWorkers=${testWorkers}`, testWorkers))
  // Use the inverse of because testCache default to true
  cmdArgs.push(addFlag(`no-cache`, !testCache))
  cmdArgs.push(addFlag(`detectOpenHandles`, testOpenHandles))

  cmdArgs.push(addFlag('bail', testBail))
  cmdArgs.push(addFlag('debug', testDebug))
  cmdArgs.push(addFlag('passWithNoTests', noTests))
  cmdArgs.push(addFlag(`config=${jestConfig}`, jestConfig))

  // Only set runInBand if testWorkers not set.
  // They can not both be passed, and runInBand has a default
  // So if workers is set, then it will override runInBand and its default
  !testWorkers && cmdArgs.push(addFlag('runInBand', testSync))

  // If context is set use that as the only file to run
  // Uses Jest pattern matching functionality to find the correct test to run
  // See https://jestjs.io/docs/cli#jest-regexfortestfiles for more info
  context && cmdArgs.push(context)

  return uniqArr(cmdArgs.filter(arg => arg))
}

module.exports = {
  buildJestArgs,
}
