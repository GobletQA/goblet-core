/**
 * --- **IMPORTANT** ---
 * This file should never be imported directly
 * Use the getGobletConfig to load the herkin.config file
 * --- **IMPORTANT** ---
 */

const { firebase } = require('./firebase.config')
const { serverConfig } = require('./server.config.js')
const { sockrCmds } = require('./sockrCmds.config.js')
const { screencastConfig } = require('./screencast.config.js')

const {
  GOBLET_ROOT,
  GOBLET_ARTIFACTS_DIR,
  GOBLET_REPORTS_DIR,
  GOBLET_REPO_ROOT,
  GOBLET_FEATURES_DIR,
  GOBLET_STEPS_DIR,
  GOBLET_SUPPORT_DIR,
  GOBLET_UNIT_DIR,
  GOBLET_WAYPOINT_DIR,
  GOBLET_WORK_DIR,
  GOBLET_PW_METADATA_DIR,
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
   * Options for browser recorder
   * @type {Object}
   */
  recorder: {
    locator: `-- 🍷 GOBLET`,
  },

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
    repoRoot: GOBLET_REPO_ROOT,
    /**
     * Path to the herkin folder, **Relative to the repoRoot**
     * @type {string} - Relative Path
     */
    workDir: GOBLET_WORK_DIR,

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
    reportsDir: GOBLET_REPORTS_DIR,

    /**
     * Path to the test artifacts folder
     * Stores downloaded files, and video recordings of browser interactions
     * Relative to the `<repoRoot>/<workDir>/`
     * @type {string} - Relative Path
     * @example - "/artifacts"
     */
    artifactsDir: GOBLET_ARTIFACTS_DIR,

    /**
     * Path to the Gherkin feature folder
     * Contains feature files using Gherkin syntax (Parkin Variation)
     * Relative to the `<repoRoot>/<workDir>/`
     * @type {string} - Relative Path
     * @example - "/bdd/features"
     */
    featuresDir: GOBLET_FEATURES_DIR,
    
    /**
     * Path to the feature step definitions
     * Contains custom step definitions matching feature file steps
     * Joined with the default Keg-Herkin Step Definitions
     * Relative to the `<repoRoot>/<workDir>/`
     * @type {string} - Relative Path
     * @example - "/bdd/steps"
     */
    stepsDir: GOBLET_STEPS_DIR,

    /**
     * Path to the Parkin / Features / Steps support files
     * Extra files for configuring / supporting Parkin parsing and test execution
     * Relative to the `<repoRoot>/<workDir>/`
     * @type {string} - Relative Path
     * @example - "/bdd/support"
     */
    supportDir: GOBLET_SUPPORT_DIR,

    /**
     * Path to the Jest unit tests directory containing unit test files
     * Test File names should match one of the following patterns
     *  `unit.*.js || *.unit.js || un.*.js || *.un.js || test.*.js || *.test.js`
     * Relative to the `<repoRoot>/<workDir>/`
     * @type {string} - Relative Path
     * @example - "/unit"
     */
    unitDir: GOBLET_UNIT_DIR,

    /**
     * Path to the Jest unit tests directory containing unit test files
     * Test File names should match one of the following patterns
     *  `waypoint.*.js || *.waypoint.js || wp.*.js || *.wp.js || test.*.js || *.test.js`
     * Relative to the `<repoRoot>/<workDir>/`
     * @type {string} - Relative Path
     * @example - "/waypoint"
     */
    waypointDir: GOBLET_WAYPOINT_DIR,
  },

  /**
   * This section **OVERRIDES** all other config settings
   * Should **NOT** be defined in a repos herkin config file
   * These paths should always exist on the loaded herkin.config object
   */
  internalPaths: {
    gobletRoot: GOBLET_ROOT,
    testUtilsDir: TEST_UTILS_PATH,
    pwMetaDataDir: GOBLET_PW_METADATA_DIR,
  },

  /** Property to define a valid herkin config object */
  __VALID_GOBLET_CONFIG: true,
}
