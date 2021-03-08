const path = require('path')
const { serverConfig } = require('./server.config.js')
const { sockrCmds } = require('./sockrCmds.config.js')

const {
  DOC_APP_PATH,
  HERKIN_TESTS_ROOT,
  HERKIN_FEATURES_DIR,
  HERKIN_STEPS_DIR,
  HERKIN_SUPPORT_DIR,
  HERKIN_UNIT_DIR,
  HERKIN_WAYPOINT_DIR,
} = process.env

const rootDir = path.join(__dirname, '../')

// absolute path to tests volume inside the container
const dockerTestsRoot = path.join(rootDir, 'tests')

// absolute path to the tests folder on host machine
const hostTestsRoot = HERKIN_TESTS_ROOT || dockerTestsRoot

module.exports = {
  sockr: {
    ...sockrCmds,
    ...serverConfig,
  },
  server: serverConfig,
  paths: {
    rootDir,

    // if DOC_APP_PATH is defined, we are in the docker container, so look for tests root at <herkin-root>/tests
    testsRoot: DOC_APP_PATH 
      ? dockerTestsRoot
      : hostTestsRoot,

    stepsDir: HERKIN_STEPS_DIR || 'bdd/steps',
    featuresDir: HERKIN_FEATURES_DIR || 'bdd/features',
    supportDir: HERKIN_SUPPORT_DIR || 'bdd/support',
    unitDir: HERKIN_UNIT_DIR || 'unit',
    waypointDir: HERKIN_WAYPOINT_DIR || 'waypoint'
  },
}