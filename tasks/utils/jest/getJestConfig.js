const path = require('path')
const { fileSys } = require('@keg-hub/cli-utils')
const { jestConfigMap } = require('../../constants')

/**
 * Gets a jestConfig path from the passed on config, or the jestConfigMap based on fileType
 * Then validates the file exists, and throws if it does not
 * @function
 * @public
 * @throws
 * 
 * @param {Object} params - Options passed to the task, converted into an object
 * @param {string} type - Type of config to load based on the testing type
 * 
 * @returns {string} - Path to the found jest config
 */
const getJestConfig = async ({ testConfig, base }, type) => {
  const configLoc = testConfig ? path.join(base, testConfig) : jestConfigMap[type]

  // Check if the config path exists, if not throw
  const [existsErr, fileExists] = await fileSys.pathExists(configLoc)
  if(existsErr || !fileExists)
    throw new Error(existsErr || `The jest config path ${configLoc} does not exist`)

  return configLoc
}

module.exports = {
  getJestConfig
}