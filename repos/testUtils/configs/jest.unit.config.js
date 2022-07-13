/**
 * TODO: Update this to work with unit tests
 * Was originally copied from jest.waypoint.config
 */
const { jestConfig } = require('./jest.default.config')

const path = require('path')
const { noOpObj } = require('@keg-hub/jsutils')
const { inDocker } = require('@keg-hub/cli-utils')
const { getGobletConfig } = require('GobletSharedConfig')
const metadata = require('GobletSCPlaywright/helpers/metadata')
const { checkVncEnv } = require('GobletSCLibs/utils/vncActiveEnv')
const { getLaunchType } = require('GobletSharedUtils/getLaunchType')
const { getRepoGobletDir } = require('GobletSharedUtils/getRepoGobletDir')
const { buildJestGobletOpts } = require('GobletTestUtils/buildJestGobletOpts')
const { getContextOpts } = require('GobletSCPlaywright/helpers/getContextOpts')
const { getBrowserOpts } = require('GobletSCPlaywright/helpers/getBrowserOpts')
const { taskEnvToBrowserOpts } = require('GobletSharedUtils/taskEnvToBrowserOpts')

/**
 * Builds the launch / browser options for the jest-playwright-config
 * @param {Object} config - Global Goblet config
 * @param {Object} taskOpts - Playwright browser options set by the task starting the process
 * 
 * @returns {Object} - Built browser options
 */
const buildLaunchOpts = async (config, taskOpts, optsKey) => {
  const { vncActive, socketActive } = checkVncEnv()
  const { endpoint, launchOptions } = await metadata.read(taskOpts.type)

  /**
   * Check if the websocket is active
   * If so, then update the endpoint url to target the host machine
   */
  const wsEndpoint = socketActive
    ? inDocker()
      ? endpoint.replace('127.0.0.1', 'host.docker.internal')
      : endpoint
    : false

  /**
   * Get the property base on if VNC is active or not
   * If not active we want to connect to the host machine browser via websocket
   * See
   *  - tasks/utils/envs/buildPWEnvs.js
   *  - repos/shared/utils/taskEnvToBrowserOpts.js
   */
  const opts = {[optsKey]: getBrowserOpts(launchOptions, config)}

  // If VNC is not active, then set the websocket endpoint
  if(!vncActive) opts[optsKey].wsEndpoint = wsEndpoint

  /**
   * Extra options set for browser to run, and devices to run 
   * Set from the task that started the process
   */
  opts.browsers = [taskOpts.type]
  taskOpts.devices &&
    (opts.devices = taskOpts.devices)

  return opts
}


// It's recommend to use a separate Jest configuration jest.e2e.config.js for jest-playwright
// to gain speed improvements and by that to only use Playwright in the end-to-end tests
module.exports = async () => {
  const config = getGobletConfig()
  const baseDir = getRepoGobletDir(config)
  const taskOpts = taskEnvToBrowserOpts(config)

  /**
   * Get the property base on if VNC is active or not
   * If not active we want to connect to the host machine browser via websocket
   * See
   *  - tasks/utils/envs/buildPWEnvs.js
   *  - repos/shared/utils/taskEnvToBrowserOpts.js
   */
  const { vncActive } = checkVncEnv()
  const optsKey = vncActive ? 'launchOptions' : 'connectOptions'
  const launchOpts = await buildLaunchOpts(config, taskOpts, optsKey)
  const browserOpts = launchOpts[optsKey]
  const contextOpts = getContextOpts(noOpObj, config)

  const { testUtilsDir } = config.internalPaths

  return {
    preset: `jest-playwright-preset`,
    /** Build the default jest config for waypoint files */
    ...jestConfig(config, {
      shortcut: 'wp',
      type: 'waypoint',
      testDir: path.join(baseDir, config.paths.unitDir),
    }),
    /** Define the goblet global options durring test runs */
    globals: {
      __goblet: {
        paths: config.paths,
        browser: { options: browserOpts },
        context: { options: contextOpts },
        options: buildJestGobletOpts(config, browserOpts, contextOpts),
      },
    },
    /**
     * Set the test env for the jest-playwright plugin
     * See https://www.npmjs.com/package/jest-playwright-preset for all options
    */
    testEnvironmentOptions: {
      'jest-playwright': {
        ...launchOpts,
        launchType: getLaunchType(),
        contextOptions: getContextOpts(noOpObj, config),
      },
    },
    setupFilesAfterEnv: [
      `${testUtilsDir}/waypoint/mockEnv.js`
    ],
    /** Add the custom waypoint transformer for all found .feature files */
    transform: {
      // Add the custom waypoint transformer for waypoint files
      // TODO: add a custom transformer for unit tests
      // '^.*\\.(waypoint.js|wp.js|test.js|spec.js)$': `${testUtilsDir}/waypoint/transformer.js`,
      // '^(waypoint|wp|test|spec)\\..*\\.(js)$': `${testUtilsDir}/waypoint/transformer.js`,
      '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
    },
  }

}
