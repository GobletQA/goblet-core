const { jestConfig } = require('./jest.default.config')

const path = require('path')
const glob = require('glob')
const { uniqArr } = require('@keg-hub/jsutils')
const { getHerkinConfig } = require('HerkinSharedConfig')
const { getRepoHerkinDir } = require('HerkinSharedUtils/getRepoHerkinDir')
const { taskEnvToBrowserOpts } = require('HerkinSharedUtils/taskEnvToBrowserOpts')

/**
 * Finds all step definition files in client's step directory and
 * also in the herkin testUtilsDir repo
 * @param {Object} herkin - Global Herkin config
 *
 * @return {Array<string>} file paths
 */
const getStepDefinitions = herkin => {
  const { testUtilsDir } = herkin.internalPaths
  const { repoRoot, workDir, stepsDir } = herkin.paths
  const baseDir = workDir ? path.join(repoRoot, workDir) : repoRoot
  const clientPattern = path.join(baseDir, stepsDir, '**/*.js')
  const clientMatches = glob.sync(clientPattern)

  const herkinPattern = path.join(testUtilsDir, 'steps/**/*.js')
  const herkinMatches = glob.sync(herkinPattern)

  return uniqArr([...clientMatches, ...herkinMatches])
}

/**
 * Gets all file paths for bdd support files
 * @param {Object} herkin - Global Herkin config
 *
 * @return {Array<string>} file paths
 */
const getParkinSupport = herkin => {
  const { testUtilsDir } = herkin.internalPaths
  const { repoRoot, workDir, supportDir } = herkin.paths

  const parkinEnvironment = `${testUtilsDir}/parkin/setupTestEnvironment.js`
  const herkinHooks = `${testUtilsDir}/support/hooks`

  // Don't include the world here because it gets loaded in herkin/support/world.js
  const baseDir = workDir ? path.join(repoRoot, workDir) : repoRoot
  const pattern = path.join(baseDir, supportDir, '**/+(hook.js|setup.js)')
  const matches = glob.sync(pattern)

  // Add the default herkin hooks for setting up the tests
  // This add a beforeAll and afterAll hook to the test execution
  // Within the beforeAll hook is a call to testUtils/playwright/setupTestEnvironment.js
  // This is where the browser for the test execution is created / connected to
  matches.push(herkinHooks)

  // Add the parkin environment setup first
  // This ensures we can get access to the Parkin instance
  matches.unshift(parkinEnvironment)

  return matches
}

module.exports = async () => {
  const herkin = getHerkinConfig()
  const baseDir = getRepoHerkinDir(herkin)
  const { devices, ...browserOpts } = taskEnvToBrowserOpts(herkin)

  const { testUtilsDir } = herkin.internalPaths
  
  return {
    ...jestConfig(herkin, {
      ext: 'feature',
      title: 'Parkin',
      testDir: path.join(baseDir, herkin.paths.featuresDir),
    }),
    /**
     * Ensure only one test runs at a time
     * Allows the tests to run in sync
    */
    maxWorkers: 1,
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
      herkinBrowserOpts: browserOpts,
    },
    /** Add all support and step files and ensure they are loaded before running the tests */
    setupFilesAfterEnv: [
      ...getParkinSupport(herkin),
      ...getStepDefinitions(herkin),
    ],
    /** Add the custom Parkin transformer for all found .feature files */
    transform: {
      '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
      // Add the custom parkin transformer for feature files
      '^.*\\.feature': `${testUtilsDir}/parkin/transformer.js`,
    },
  }
}
