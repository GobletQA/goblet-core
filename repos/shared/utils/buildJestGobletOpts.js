const { toBool } = require('@keg-hub/jsutils')

/**
 * Global options for goblet passed to the Jest config global object
 * All values must be serializable
 * @params {Object} config - Goblet config
 * @params {Object} browserOpts - Configure browser options
 *
 */
const buildJestGobletOpts = (config, browserOpts) => {
  const { GOBLET_TEST_TRACING } = process.env
  const options = {}

  if(toBool(GOBLET_TEST_TRACING)) options.tracing = { screenshots: true, snapshots: true }

  return options
}


module.exports = {
  buildJestGobletOpts
}