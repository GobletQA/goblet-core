const path = require('path')
const { jestAliases, registerAliases } = require('./aliases.config')
registerAliases()

const { getHerkinConfig } = require('HerkinSharedConfig')
const { noOpObj, noPropArr, capitalize } = require('@keg-hub/jsutils')
const { buildTestMatchFiles } = require('HerkinSharedUtils/buildTestMatchFiles')

/**
 * Default config that other jest configs can use to set common config properties
 * @param {Object} herkin - Global Herkin config
 * @param {Object} opts - Custom options for the tests being run
 * @param {string} [opts.rootDir=/keg] - Absolute path to the root jest test directory
 * @param {string} opts.testDir - Absolute path to the folder containing tests to run
 * @param {string} opts.title - Test reporter title
 * @param {string} opts.type - Type of tests being run, tagged as part of the name
 * @param {string} opts.ext - Extension of the test files to find
 * @param {string} opts.shortcut - Shortcut of the test type
 * 
 * @returns {Object} - Jest config object
 */
const jestConfig = (herkin, opts=noOpObj) => {
  const { GOBLET_MOUNT_ROOT, JEST_HTML_REPORTER_OUTPUT_PATH } = process.env

  herkin = herkin || getHerkinConfig()
  const { herkinRoot } = herkin.internalPaths
  const title = opts.title || opts.type

  const testMatch = opts.testDir && (opts.type || opts.shortcut || opts.ext)
    ? buildTestMatchFiles(opts.testDir, opts)
    : noPropArr

  const reporters = ['default']
  JEST_HTML_REPORTER_OUTPUT_PATH &&
    reporters.push([
      // Since the root is not keg-herkin, we have to define the full path to the reporter
      `${herkinRoot}/node_modules/jest-html-reporter`,
      {
        pageTitle: `${title ? capitalize(title) : ``} Test Results`.trim(),
        outputPath: JEST_HTML_REPORTER_OUTPUT_PATH,
      },
    ])

  return {
    reporters,
    testMatch,
    moduleNameMapper: jestAliases,
    // Jest no loading tests outside of the rootDir
    // So set the root to be the parent of keg-herkin and the repos dir
    // If no rootDir override is set
    rootDir: opts.rootDir || path.dirname(GOBLET_MOUNT_ROOT) || '/keg',
  }
}

module.exports = {
  jestConfig
}

