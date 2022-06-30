const os = require("os")
const path = require('path')
const { jestAliases, registerAliases } = require('./aliases.config')
registerAliases()

const { getHerkinConfig } = require('HerkinSharedConfig')
const { noOpObj, noPropArr, capitalize } = require('@keg-hub/jsutils')
const { buildTestMatchFiles } = require('HerkinSharedUtils/buildTestMatchFiles')

/**
 * Builds the test reports, currently only jest-html-reporter
 * TODO: allow reporters to be more customizable
 * @param {Object} opts - Custom options for the tests being run
 * @param {Object} herkin - Global Herkin config
 *
 * @returns {Array} - Built reporters array
 */
const buildReporters = (opts=noOpObj, gobletRoot) => {
  const { JEST_HTML_REPORTER_OUTPUT_PATH } = process.env
  const title = opts.title || opts.type

  const reporters = ['default']
  JEST_HTML_REPORTER_OUTPUT_PATH &&
    reporters.push([
      // Since the root is not keg-herkin, we have to define the full path to the reporter
      `${gobletRoot}/node_modules/jest-html-reporter`,
      {
        pageTitle: `${title ? capitalize(title) : ``} Test Results`.trim(),
        outputPath: JEST_HTML_REPORTER_OUTPUT_PATH,
      },
    ])
  
  return reporters
}

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
  const { GOBLET_CONFIG_BASE, GOBLET_MOUNT_ROOT } = process.env

  herkin = herkin || getHerkinConfig()
  const { gobletRoot } = herkin.internalPaths

  const testMatch = opts.testDir && (opts.type || opts.shortcut || opts.ext)
    ? buildTestMatchFiles(opts.testDir, opts)
    : noPropArr

  return {
    testMatch,
    reporters: buildReporters(opts, gobletRoot),
    // This seems to be needed based on how the github action is setup
    // But it may be a better option then sym-linking the keg-herkin node_modules to ~/.node_modules
    // Need to investigate it
    modulePaths: [
      path.join(GOBLET_CONFIG_BASE, `node_modules`),
      path.join(gobletRoot, `node_modules`),
      path.join(os.homedir(), `.node_modules`)
    ],
    moduleNameMapper: jestAliases,
    // Jest no loading tests outside of the rootDir
    // So set the root to be the parent of keg-herkin and the repos dir
    // If no rootDir override is set
    rootDir: opts.rootDir || GOBLET_MOUNT_ROOT || '/keg',
  }
}

module.exports = {
  jestConfig
}

