const path = require('path')
const { Logger } = require('@keg-hub/cli-utils')
const { statusHerkin } = require('../../src/herkin/statusHerkin')

const localMount = path.join(__dirname, '../../../../herkin')
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
        `The statusHerkin workflow failed. Invalid status object returned`,
        checkStatus,
        status
      )
  })
}

module.exports = (async () => {
  /** ---- Local No-Mount check ---- */
  const noLocalRepo = await statusHerkin({
    ...defConf,
    paths: {
      repoRoot: localMount,
    },
  })
  checkMountKeys(localStatus.noMount, noLocalRepo)
  Logger.info(` - No local mount status check passed`)

  /** ---- Local With-Mount check ---- */
  const withLocalMount = await statusHerkin({
    ...defConf,
    // Use the herkin root that does not have the herkin empty file
    // This simulates a mounted repo
    paths: { repoRoot: gobletRoot },
  })
  checkMountKeys(localStatus.withMount, withLocalMount)
  Logger.info(` - With local mount status check passed`)

  /** ---- Vnc No-Mount Check ---- */
  const noVNCMount = await statusHerkin({
    ...defConf,
    screencast: { active: true },
    paths: { repoRoot: localMount },
  })
  checkMountKeys(vncStatus.noMount, noVNCMount)
  Logger.info(` - No VNC mount status check passed`)

  /** ---- Vnc With-Mount Check ---- */
  const withVNCMount = await statusHerkin({
    ...defConf,
    repo: { url: `github.com/KegHub/tap` },
    screencast: { active: true },
    // Use the herkin root that does not have the herkin empty file
    // This simulates a mounted repo
    paths: { repoRoot: gobletRoot },
  })
  checkMountKeys(vncStatus.withMount, withVNCMount)
  Logger.info(` - With VNC mount status check passed`)

  Logger.success(`\nstatusHerkin E2E test successful\n`)
  Logger.empty()
})()
