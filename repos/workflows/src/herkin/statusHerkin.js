const path = require('path')
const { noOpObj } = require('@keg-hub/jsutils')
const { Logger } = require('@keg-hub/cli-utils')
const { LOCAL_MOUNT } = require('../constants')
const { getRepoName } = require('../utils/getRepoName')
const { isRepoMounted } = require('../gitfs/isRepoMounted')
const { loadHerkinConfig } = require('../utils/loadHerkinConfig')

const { fileSys } = require('@keg-hub/cli-utils')

const { pathExists } = fileSys

/**
 * @typedef {Object} RepoStatus
 * @property {boolean} mounted - If a repo is mounted
 * @property {string} status - Mounted status as a string
 * @property {string} mode - Current mode of Keg-Herkin, determines a repo folder location
 * @property {string} [message] - Message about the status
 * @property {string} [location] - Locations where the repo should exist
 *
 */

const validatePath = async location => {
  const [err, exists] = await pathExists(location)
  if (err && err.code !== `ENOENT`) throw new Error(err)

  return exists
}

/**
 * Checks the status of a mounted repo for local mode
 * In local mode the folder path is always the same
 * The local mounted folder contains a `.herkin-empty-status.json` file
 * If this file exists, then no mount exists
 * If it does not exist, then the folder was overwritten with the mount
 * So we know a mount exists
 * @param {Object} config - Global Herkin config object
 *
 * @return {RepoStatus} - Status object for the checked repo
 */
const statusForLocal = async (config, metadata) => {
  Logger.info(`Checking repo status in local mode...`)

  const isValidPath = await validatePath(LOCAL_MOUNT)

  // Check if the local mount folder exists
  // If not then it's empty
  const herkinConfig = isValidPath && (await loadHerkinConfig(LOCAL_MOUNT))

  return !isValidPath || !herkinConfig
    ? {
        repo: {
          git: { local: config.paths.repoRoot },
          ...config,
        },
        mode: `local`,
        mounted: false,
        status: `unmounted`,
        message: `Repo volume mount does not exist`,
      }
    : {
        mode: 'local',
        mounted: true,
        status: 'mounted',
        repo: {
          git: { local: herkinConfig.paths.repoRoot },
          name: path.basename(herkinConfig.paths.repoRoot),
          ...herkinConfig,
        },
      }
}

/**
 * In VNC mode, if we have a user Id we can check if the repo is mounted
 * Otherwise we just return unknown status
 * @param {Object} config - Global Herkin config object
 * @param {Object} config.repo - Repo config || Repo class instance
 * @param {string} config.repo.url - Url of the repo to check
 * @param {string} config.url - Url of the repo to check if repo.url does not exist
 * @param {Object} config.user - User model object
 * @param {string} config.username - Git Provider user name
 *
 * @return {RepoStatus} - Status object for the checked repo
 */
const statusForVnc = async (config, metadata = noOpObj) => {
  Logger.info(`Checking repo status in vnc mode...`)

  const unknownStatus = { mode: 'vnc', mounted: false, status: 'unknown' }

  const { username, branch, remote, local } = metadata

  if (!username && !branch && !remote && !local) return unknownStatus

  /*
   * Use local to find the herkin.config
   * Load the herkin config and build the repo
   * respond with status and loaded repo
   */
  const isMounted = await isRepoMounted(null, local)
  if (!isMounted) return unknownStatus

  Logger.log(`Loading herkin.config...`)
  const herkinConfig = await loadHerkinConfig(local)

  return !herkinConfig
    ? unknownStatus
    : {
        mode: 'vnc',
        mounted: true,
        status: 'mounted',
        repo: {
          git: metadata,
          ...herkinConfig,
          name: getRepoName(remote),
        },
      }
}

/**
 * Default implementation for running Keg-Herkin locally
 * This is expected to be overwritten by External Services
 * Builds a Repo Model Object based on the local metadata
 *
 * @param {Object} config - Global Herkin config object
 * @param {Object} metadata - Git Metadata about the repo
 *
 * @return {RepoStatus} - Status object for the checked repo
 */
const statusHerkin = async (config, metadata, log=true) => {
  log && Logger.subHeader(`Running Status Herkin Workflow`)

  if (!config)
    throw new Error(`The statusHerkin workflow requires a herkin config object`)

  return config?.screencast?.active
    ? await statusForVnc(config, metadata)
    : await statusForLocal(config, metadata)
}

module.exports = {
  statusHerkin,
}
