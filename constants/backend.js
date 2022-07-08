/**
 * Server specific constants / envs only
 * Only values needed to run the backend / socket / screencast servers
 * Client specific config should not be loaded from here
 */

const path = require('path')
const { getRepoPaths } = require('./repos')
const { deepFreeze } = require('@keg-hub/jsutils')

const { GOBLET_ROOT, ...repoPaths } = getRepoPaths()
const {
  DOC_APP_PATH,
  GOBLET_REPO_ROOT,
  GOBLET_WORK_DIR = `goblet`,
  GOBLET_ARTIFACTS_DIR = `artifacts`,
  GOBLET_REPORTS_DIR = `reports`,
  GOBLET_FEATURES_DIR = `bdd/features`,
  GOBLET_STEPS_DIR = `bdd/steps`,
  GOBLET_SUPPORT_DIR = `bdd/support`,
  GOBLET_UNIT_DIR = `unit`,
  GOBLET_WAYPOINT_DIR = `waypoint`,
  GOBLET_PW_METADATA_DIR,
} = process.env

/**
 * Constants that define overridable location to test directories
 */
const dirsFromEnvs = deepFreeze({
  GOBLET_REPORTS_DIR,
  GOBLET_ARTIFACTS_DIR,
  GOBLET_FEATURES_DIR,
  GOBLET_STEPS_DIR,
  GOBLET_SUPPORT_DIR,
  GOBLET_UNIT_DIR,
  GOBLET_WAYPOINT_DIR,
  GOBLET_WORK_DIR,
})

// TODO: fix this. It's only valid when in local mode and no locally mounted folder exists
// absolute path to tests volume inside the container
const dockerTestsRoot = path.join(GOBLET_ROOT, 'goblet')
// absolute path to the tests folder on host machine
const hostRoot = GOBLET_REPO_ROOT || dockerTestsRoot
// Set the test root based on if DOC_APP_PATH is set ( In a docker container )
const repoRoot = DOC_APP_PATH ? dockerTestsRoot : hostRoot

/**
 * Constants that should only be imported in a node runtime environment, the backend
 */
module.exports = deepFreeze({
  GOBLET_ROOT,
  GOBLET_PW_METADATA_DIR,
  // IMPORTANT - GOBLET_REPO_ROOT can not be used as root folder for a clients repo
  // It should only be used when running from a local environment
  // if DOC_APP_PATH, we are a docker container, so look for tests at <goblet-root>/tests
  GOBLET_REPO_ROOT: repoRoot,
  ...dirsFromEnvs,
  ...repoPaths,
})
