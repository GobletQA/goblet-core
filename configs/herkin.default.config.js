const path = require('path')
const { serverConfig } = require('./server.config.js')
const { sockrCmds } = require('./sockrCmds.config.js')
const {
  HERKIN_ROOT,
  HERKIN_ARTIFACTS_DIR,
  HERKIN_REPORTS_DIR,
  HERKIN_TESTS_ROOT,
  HERKIN_FEATURES_DIR,
  HERKIN_STEPS_DIR,
  HERKIN_SUPPORT_DIR,
  HERKIN_UNIT_DIR,
  HERKIN_WAYPOINT_DIR,
  SCREENCAST_API_PORT,
  SCREENCAST_PROXY_HOST,
  TEST_TYPES,
} = require('../constants/backend')

module.exports = {
  sockr: {
    ...sockrCmds,
    ...serverConfig,
  },
  screencast: {
    // Proxy settings, for connecting the backend API to the noVNC server
    proxy: {
      host: SCREENCAST_PROXY_HOST || serverConfig.host || '0.0.0.0',
      port: process.env.NO_VNC_PORT || 26369,
      path: '/novnc',
    },
    // Uses to start separate screencast API
    server: {
      host: SCREENCAST_PROXY_HOST || serverConfig.host || '0.0.0.0',
      port: SCREENCAST_API_PORT,
    },
    // Default playwright browser context settings
    // TODO: add defaults here for Screencast
    context: {},
    // Default playwright browser launch settings
    // TODO: add defaults here for Screencast
    browser: {},
    // Default tigervnc server settings
    // TODO: add defaults here for Screencast
    vnc: {},
    // Default websockify server settings
    // TODO: add defaults here for Screencast
    sockify: {},
  },
  server: serverConfig,
  paths: {
    rootDir: HERKIN_ROOT,
    reportsDir: HERKIN_REPORTS_DIR,
    testsRoot: HERKIN_TESTS_ROOT,
    artifactsDir: HERKIN_ARTIFACTS_DIR,
    featuresDir: HERKIN_FEATURES_DIR,
    stepsDir: HERKIN_STEPS_DIR,
    supportDir: HERKIN_SUPPORT_DIR,
    unitDir: HERKIN_UNIT_DIR,
    waypointDir: HERKIN_WAYPOINT_DIR
  },
  testTypes: TEST_TYPES,
}
