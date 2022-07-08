const path = require('path')
const { Logger } = require('@keg-hub/cli-utils')
const { statusGoblet } = require('../../src/goblet/statusGoblet')

const localMount = path.join(__dirname, '../../../../goblet')
const gobletRoot = path.join(__dirname, '../../../../')

const defConf = {
  sockr: {},
  paths: {},
  server: {},
  fileTypes: {},
  screencast: {},
  internalPaths: {},
}

const localStatus = {
  noMount: { mode: `local`, mounted: false, status: `unmounted` },
  withMount: { mode: `local`, mounted: true, status: `mounted` },
}
const vncStatus = {
  noMount: { mode: 'vnc', mounted: false, status: 'unknown' },
  withMount: { mode: 'vnc', mounted: true, status: 'mounted' },
}

const workflowError = (message, checkStatus, status) => {
  Logger.error(`[ERROR] - ${message}`)
  Logger.log(`Expected:`, checkStatus)
  Logger.log(`Actual:`, status)
  Logger.empty()

  process.exit(1)
}

const checkMountKeys = (checkStatus, status) => {
  Object.keys(checkStatus).map(key => {
    checkStatus[key] !== status[key] &&
      workflowError(
        `The statusGoblet workflow failed. Invalid status object returned`,
        checkStatus,
        status
      )
  })
}

module.exports = (async () => {
  /** ---- Local No-Mount check ---- */
  const noLocalRepo = await statusGoblet({
    ...defConf,
    paths: {
      repoRoot: localMount,
    },
  })
  checkMountKeys(localStatus.noMount, noLocalRepo)
  Logger.info(` - No local mount status check passed`)

  /** ---- Local With-Mount check ---- */
  const withLocalMount = await statusGoblet({
    ...defConf,
    // Use the goblet root that does not have the goblet empty file
    // This simulates a mounted repo
    paths: { repoRoot: gobletRoot },
  })
  checkMountKeys(localStatus.withMount, withLocalMount)
  Logger.info(` - With local mount status check passed`)

  /** ---- Vnc No-Mount Check ---- */
  const noVNCMount = await statusGoblet({
    ...defConf,
    screencast: { active: true },
    paths: { repoRoot: localMount },
  })
  checkMountKeys(vncStatus.noMount, noVNCMount)
  Logger.info(` - No VNC mount status check passed`)

  /** ---- Vnc With-Mount Check ---- */
  const withVNCMount = await statusGoblet({
    ...defConf,
    repo: { url: `github.com/KegHub/tap` },
    screencast: { active: true },
    // Use the goblet root that does not have the goblet empty file
    // This simulates a mounted repo
    paths: { repoRoot: gobletRoot },
  })
  checkMountKeys(vncStatus.withMount, withVNCMount)
  Logger.info(` - With VNC mount status check passed`)

  Logger.success(`\nstatusGoblet E2E test successful\n`)
  Logger.empty()
})()
