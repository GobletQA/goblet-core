/**
 * Server specific constants / envs only
 * Only values needed to run the backend / socket / screencast servers
 * Client specific config should not be loaded from here
 */

const path = require('path')
const { getRepoPaths } = require('./repos')
const { deepFreeze } = require('@keg-hub/jsutils')

const { HERKIN_ROOT, ...repoPaths } = getRepoPaths()
const {
  DOC_APP_PATH,
  HERKIN_REPO_ROOT,
  HERKIN_WORK_DIR = `herkin`,
  HERKIN_ARTIFACTS_DIR = `artifacts`,
  HERKIN_REPORTS_DIR = `reports`,
  HERKIN_FEATURES_DIR = `bdd/features`,
  HERKIN_STEPS_DIR = `bdd/steps`,
  HERKIN_SUPPORT_DIR = `bdd/support`,
  HERKIN_UNIT_DIR = `unit`,
  HERKIN_WAYPOINT_DIR = `waypoint`,
  HERKIN_PW_METADATA_DIR,
} = process.env

/**
 * Constants that define overridable location to test directories
 */
const dirsFromEnvs = deepFreeze({
  HERKIN_REPORTS_DIR,
  HERKIN_ARTIFACTS_DIR,
  HERKIN_FEATURES_DIR,
  HERKIN_STEPS_DIR,
  HERKIN_SUPPORT_DIR,
  HERKIN_UNIT_DIR,
  HERKIN_WAYPOINT_DIR,
  HERKIN_WORK_DIR,
})

// TODO: fix this. It's only valid when in local mode and no locally mounted folder exists
// absolute path to tests volume inside the container
const dockerTestsRoot = path.join(HERKIN_ROOT, 'herkin')
// absolute path to the tests folder on host machine
const hostRoot = HERKIN_REPO_ROOT || dockerTestsRoot
// Set the test root based on if DOC_APP_PATH is set ( In a docker container )
const repoRoot = DOC_APP_PATH ? dockerTestsRoot : hostRoot

/**
 * Constants that should only be imported in a node runtime environment, the backend
 */
module.exports = deepFreeze({
  HERKIN_ROOT,
  HERKIN_PW_METADATA_DIR,
  // IMPORTANT - HERKIN_REPO_ROOT can not be used as root folder for a clients repo
  // It should only be used when running from a local environment
  // if DOC_APP_PATH, we are a docker container, so look for tests at <herkin-root>/tests
  HERKIN_REPO_ROOT: repoRoot,
  ...dirsFromEnvs,
  ...repoPaths,
})
