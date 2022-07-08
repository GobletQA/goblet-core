const { addEnv } = require('../envs/addEnv')
const { buildReportTitle } = require('GobletTest/reports/buildReportTitle')

/**
 * Builds the envs set in the command that runs a test
 * @param {String} browser - playwright browser name
 * @param {Object} context - `run` task params.context value
 * @param {Object} reportPath - Path where the test report should be saved
 * @param {string} [type=feature] - Type of tests being run
 *
 * @return {Object} dockerCmd options object, with envs
 */
const buildJestTestEnvs = (env={}, context, reportPath, type) => {
  if(!type || !reportPath || !context) return env
  
  // Add the default playwright envs
  env.JEST_HTML_REPORTER_INCLUDE_FAILURE_MSG = true
  env.JEST_HTML_REPORTER_INCLUDE_SUITE_FAILURE = true

  // Build the output path, and page title based on the passed in context
  addEnv(env, 'JEST_HTML_REPORTER_OUTPUT_PATH', reportPath)
  addEnv(
    env,
    'JEST_HTML_REPORTER_PAGE_TITLE',
    Boolean(type && context),
    buildReportTitle(type, context)
  )

  return env
}

module.exports = {
  buildJestTestEnvs,
}
