// Must load this first because it loads the alias
const { jestConfig } = require('./jest.default.config')

const path = require('path')
const glob = require('glob')
const { uniqArr, noOpObj } = require('@keg-hub/jsutils')
const { getGobletConfig } = require('GobletSharedConfig')
const { getRepoGobletDir } = require('GobletSharedUtils/getRepoGobletDir')
const { getContextOpts } = require('GobletSCPlaywright/helpers/getContextOpts')
const { buildJestGobletOpts } = require('GobletSharedUtils/buildJestGobletOpts')
const { taskEnvToBrowserOpts } = require('GobletSharedUtils/taskEnvToBrowserOpts')

/**
 * Finds all step definition files in client's step directory and
 * also in the config testUtilsDir repo
 * @param {Object} config - Global Herkin config
 *
 * @return {Array<string>} file paths
 */
const getStepDefinitions = config => {
  const { testUtilsDir } = config.internalPaths
  const { repoRoot, workDir, stepsDir } = config.paths
  const baseDir = workDir ? path.join(repoRoot, workDir) : repoRoot
  const clientPattern = path.join(baseDir, stepsDir, '**/*.js')
  const clientMatches = glob.sync(clientPattern)

  const configPattern = path.join(testUtilsDir, 'steps/**/*.js')
  const configMatches = glob.sync(configPattern)

  return uniqArr([...clientMatches, ...configMatches])
}

/**
 * Gets all file paths for bdd support files
 * @param {Object} config - Global Herkin config
 *
 * @return {Array<string>} file paths
 */
const getParkinSupport = config => {
  const { testUtilsDir } = config.internalPaths
  const { repoRoot, workDir, supportDir } = config.paths

  const parkinEnvironment = `${testUtilsDir}/parkin/parkinTestEnv.js`

  // **IMPORTANT** - Must be loaded after the parkinEnvironment 
  const configHooks = `${testUtilsDir}/support/hooks`

  // Don't include the world here because it gets loaded in config/support/world.js
  const baseDir = workDir ? path.join(repoRoot, workDir) : repoRoot
  const pattern = path.join(baseDir, supportDir, '**/+(hooks.js|hook.js|setup.js)')
  const matches = glob.sync(pattern)

  // Add the default config hooks for setting up the tests
  // This adds a BeforeAll and AfterAll hook to the test execution
  // Were the `initialize` method from `playwrightTestEnv.js` is registered with the BeforeAll hook
  // This is where the browser for the test execution is created / connected to
  matches.unshift(configHooks)

  // MUST BE LOADED FIRST - Add the parkin environment setup before all other setup files
  // This ensures we can get access to the Parkin instance on the global object
  matches.unshift(parkinEnvironment)

  return matches
}

module.exports = async () => {
  const config = getGobletConfig()
  const baseDir = getRepoGobletDir(config)
  const { devices, ...browserOpts } = taskEnvToBrowserOpts(config)
  const contextOpts = getContextOpts(noOpObj, config)

  const { testUtilsDir } = config.internalPaths
  const defConf = jestConfig(config, {
    ext: 'feature',
    title: 'Parkin',
    testDir: path.join(baseDir, config.paths.featuresDir),
  })

  return {
    ...defConf,
    /** Add feature as an extension that can be loaded */
    moduleFileExtensions: [
      'feature',
      'js',
      'json',
      'ts',
      'tsx'
    ],
    /** Pass on the browser options defined from the task that started the process */
    globals: {
      __goblet: {
        paths: config.paths,
        browser: { options: browserOpts },
        context: { options: contextOpts },
        options: buildJestGobletOpts(config, browserOpts),
      },
    },
    /** Add all support and step files and ensure they are loaded before running the tests */
    setupFilesAfterEnv: [
      ...getParkinSupport(config),
      ...getStepDefinitions(config),
    ],
    /** Add the custom Parkin transformer for all found .feature files */
    transform: {
      '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
      // Add the custom parkin transformer for feature files
      '^.*\\.feature': `${testUtilsDir}/parkin/transformer.js`,
    },
  }
}