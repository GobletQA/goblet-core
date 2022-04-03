/**
 * --- **IMPORTANT** ---
 * This file should never be imported directly
 * Use the getHerkinConfig to load the herkin.config file
 * --- **IMPORTANT** ---
 */

const { firebase } = require('./firebase.config')
const { serverConfig } = require('./server.config.js')
const { sockrCmds } = require('./sockrCmds.config.js')
const { screencastConfig } = require('./screencast.config.js')

const {
  HERKIN_ROOT,
  HERKIN_ARTIFACTS_DIR,
  HERKIN_REPORTS_DIR,
  HERKIN_REPO_ROOT,
  HERKIN_FEATURES_DIR,
  HERKIN_STEPS_DIR,
  HERKIN_SUPPORT_DIR,
  HERKIN_UNIT_DIR,
  HERKIN_WAYPOINT_DIR,
  HERKIN_WORK_DIR,
  HERKIN_PW_METADATA_DIR,
  TEST_UTILS_PATH,
} = require('../constants/backend')

module.exports = {
  firebase,
  sockr: {
    ...sockrCmds,
    ...serverConfig.sockr,
  },
  server: serverConfig,
  screencast: screencastConfig,

  /**
   * Paths to a repos herkin specific files
   * @type {Object}
   */
  paths: {
    /**
     * Path to the connected repo's root directory
     * i.e. /keg/repos/<git-user-name>/current
     * @type {string} - Absolute Path
     */
    repoRoot: HERKIN_REPO_ROOT,
    /**
     * Path to the herkin folder, **Relative to the repoRoot**
     * @type {string} - Relative Path
     */
    workDir: HERKIN_WORK_DIR,

  /**
   * **The below paths are all relative to "<repoRoot>/<workDir>/"**
   * repoRoot - Absolute path to the repo
   * workDir - Relative path to the herkin folder of the repo
   * All other paths - "<repoRoot>/<workDir>/<type>"
   */

    /**
     * Path to the test reports folder
     * Where reports for test runs are saved
     * Relative to the "<repoRoot>/<workDir>/"
     * @type {string} - Relative Path
     * @example - "/reports"
     */
    reportsDir: HERKIN_REPORTS_DIR,

    /**
     * Path to the test artifacts folder
     * Stores downloaded files, and video recordings of browser interactions
     * Relative to the `<repoRoot>/<workDir>/`
     * @type {string} - Relative Path
     * @example - "/artifacts"
     */
    artifactsDir: HERKIN_ARTIFACTS_DIR,

    /**
     * Path to the Gherkin feature folder
     * Contains feature files using Gherkin syntax (Parkin Variation)
     * Relative to the `<repoRoot>/<workDir>/`
     * @type {string} - Relative Path
     * @example - "/bdd/features"
     */
    featuresDir: HERKIN_FEATURES_DIR,
    
    /**
     * Path to the feature step definitions
     * Contains custom step definitions matching feature file steps
     * Joined with the default Keg-Herkin Step Definitions
     * Relative to the `<repoRoot>/<workDir>/`
     * @type {string} - Relative Path
     * @example - "/bdd/steps"
     */
    stepsDir: HERKIN_STEPS_DIR,

    /**
     * Path to the Parkin / Features / Steps support files
     * Extra files for configuring / supporting Parkin parsing and test execution
     * Relative to the `<repoRoot>/<workDir>/`
     * @type {string} - Relative Path
     * @example - "/bdd/support"
     */
    supportDir: HERKIN_SUPPORT_DIR,

    /**
     * Path to the Jest unit tests directory containing unit test files
     * Test File names should match one of the following patterns
     *  `unit.*.js || *.unit.js || un.*.js || *.un.js || test.*.js || *.test.js`
     * Relative to the `<repoRoot>/<workDir>/`
     * @type {string} - Relative Path
     * @example - "/unit"
     */
    unitDir: HERKIN_UNIT_DIR,

    /**
     * Path to the Jest unit tests directory containing unit test files
     * Test File names should match one of the following patterns
     *  `waypoint.*.js || *.waypoint.js || wp.*.js || *.wp.js || test.*.js || *.test.js`
     * Relative to the `<repoRoot>/<workDir>/`
     * @type {string} - Relative Path
     * @example - "/waypoint"
     */
    waypointDir: HERKIN_WAYPOINT_DIR,
  },

  /**
   * This section **OVERRIDES** all other config settings
   * Should **NOT** be defined in a repos herkin config file
   * These paths should always exist on the loaded herkin.config object
   */
  internalPaths: {
    herkinRoot: HERKIN_ROOT,
    testUtilsDir: TEST_UTILS_PATH,
    pwMetaDataDir: HERKIN_PW_METADATA_DIR,
  },

  /** Property to define a valid herkin config object */
  __VALID_HERKIN_CONFIG: true,
}
