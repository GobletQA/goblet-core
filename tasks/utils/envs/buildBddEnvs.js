const { addEnv } = require('./addEnv')
const { buildPWEnvs } = require('./buildPWEnvs')
const { buildJestTestEnvs } = require('../jest/buildJestTestEnvs')

/**
 * Builds the envs set in the command that runs a test
 * @param {String} browser - playwright browser name
 * @param {Object} params - `run` task params
 * @param {Object} reportPath - Path where the test report should be saved
 * @param {string} [type=feature] - Type of tests being run
 *
 * @return {Object} dockerCmd options object, with envs
 */
const buildBddEnvs = (browser, params, reportPath, type='feature') => {
  // Add the default playwright envs
  const env = buildPWEnvs({}, browser, params)

  // Add feature file specific envs
  addEnv(env, 'GOBLET_CONFIG_BASE', params.base)
  addEnv(env, 'GOBLET_FEATURE_TAGS', params.tags)
  addEnv(env, 'GOBLET_FEATURE_NAME', params.filter)
  addEnv(env, 'GOBLET_TEST_RETRY', params.testRetry)
  addEnv(env, 'GOBLET_TEST_TYPE', type === 'feature' ? `bdd` : type)

  // Set up html test reporting ENV for jest
  buildJestTestEnvs(browser, env, params.context, reportPath, type)

  return {env}
}

module.exports = {
  buildBddEnvs,
}
