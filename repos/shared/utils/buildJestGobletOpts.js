const { toBool, get } = require('@keg-hub/jsutils')

/**
 * Global options for goblet passed to the Jest config global object
 * All values must be serializable
 * @params {Object} config - Goblet config
 * @params {Object} browserOpts - Configure browser options
 *
 */
const buildJestGobletOpts = (config, browserOpts, contextOpts) => {
  const { GOBLET_TEST_TRACING, GOBLET_TEST_TYPE } = process.env
  const options = {}

  const recordVideoDir = get(contextOpts, `recordVideo.dir`)
  if(recordVideoDir) options.recordVideoDir = recordVideoDir

  if(GOBLET_TEST_TYPE) options.testType = GOBLET_TEST_TYPE
  if(toBool(GOBLET_TEST_TRACING)) options.tracing = { screenshots: true, snapshots: true }

  return options
}


module.exports = {
  buildJestGobletOpts
}