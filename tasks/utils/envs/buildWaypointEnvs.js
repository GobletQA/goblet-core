const { addEnv } = require('./addEnv')
const { buildPWEnvs } = require('./buildPWEnvs')
const { setNodePath } = require('./setNodePath')
const { buildJestTestEnvs } = require('../jest/buildJestTestEnvs')

/**
 * Waypoint specific ENVs to add to the current process
 * Uses the passed in params and browser to set the values
 * Automatically adds to the current process
 * 
 * @param {Object} env - Object that holds the Envs
 * @param {string} browser - Name of the browser the ENVs relate to
 * @param {Object} params - Options passed from the task parsed into an Object with args-parse
 * 
 * @returns {Object} - env object with the ENVs added
 */
const buildWaypointEnvs = (browser, params, reportPath, type) => {
  const env = buildPWEnvs({}, browser, params)

  // TODO: Update to use the HERKIN_APP_URL
  // Normalize between HERKIN_APP_URL
  addEnv(env, 'HERKIN_APP_URL', params.appUrl)
  addEnv(env, 'HERKIN_CONFIG_BASE', params.base)
  addEnv(env, 'HERKIN_BROWSER_LAUNCH_TYPE', params.launchType)

  // Set up html test reporting ENV for jest
  buildJestTestEnvs(env, params.context, reportPath, type)

  // Set the NODE_PATH env, defaults setting it to /keg/tap/node_modules
  setNodePath(env, true)

  return {env}
}

module.exports = {
  buildWaypointEnvs
}