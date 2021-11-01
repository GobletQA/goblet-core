const { exists } = require('@keg-hub/jsutils')
const { buildReportTitle } = require('../reporter/buildReportTitle')

/**
 * Adds an env to the envs object when value exists
 * @param {Object} envs - Object to add the env to
 * @param {String} key - Name of the env to add
 * @return {String} value - Value of the env
 */
const addEnv = (envs, key, value) => {
  exists(value) && (envs[key] = value)

  return envs
}

/**
 * Builds the envs set in the command that runs a test
 * @param {String} browser - playwright browser name
 * @param {Object} params - `run` task params
 * @param {Object} reportPath - Path where the test report should be saved
 * @param {string} [type=feature] - Type of tests being run
 *
 * @return {Object} dockerExec options object, with envs
 */
const buildCmdOpts = (browser, params, reportPath, type='feature') => {
  const envs = {
    HOST_BROWSER: browser,
    JEST_HTML_REPORTER_INCLUDE_FAILURE_MSG: true,
    JEST_HTML_REPORTER_INCLUDE_SUITE_FAILURE: true,
  }

  addEnv(envs, 'DEBUG', params.debug && 'pw:api')
  addEnv(envs, 'HERKIN_FEATURE_TAGS', params.tags)
  addEnv(envs, 'HERKIN_FEATURE_NAME', params.filter)

  // Build the output path, and page title based on the passed in context
  // Uses the word "features" when no context is passed
  addEnv(envs, 'JEST_HTML_REPORTER_OUTPUT_PATH', reportPath)
  addEnv(envs, 'JEST_HTML_REPORTER_PAGE_TITLE', buildReportTitle(type, params.context))

  return { envs }
}


module.exports = {
  buildCmdOpts
}