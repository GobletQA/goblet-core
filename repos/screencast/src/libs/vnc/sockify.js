const { Logger } = require('@keg-hub/cli-utils')
const { getHerkinConfig } = require('HerkinSharedConfig')
const { findProc, killProc } = require('HerkinSCLibs/proc')
const { create: childProc } = require('@keg-hub/spawn-cmd/src/childProcess')
const {
  checkCall,
  deepMerge,
  flatUnion,
  limbo,
  noOpObj,
  noPropArr,
} = require('@keg-hub/jsutils')

/**
 * Cache holder for the websockify process
 * @type {Object|undefined}
 */
let SOCK_PROC

/**
 * Starts websockify to allow loading VNC in the browser
 * @function
 * @public
 * @param {Object} args - options for setting up websockify
 * @param {Array} args.args - Arguments to pass to the websockify command
 * @param {Array} args.cwd - Location where the command should be run
 * @param {Array} args.env - Extra environment variables to pass
 *
 * @example
 * websockify -v --web /usr/share/novnc 0.0.0.0:26369 0.0.0.0:26370
 * @returns {Object} - Child process running websockify
 */
const startSockify = async ({
  args = noPropArr,
  cwd,
  options = noOpObj,
  env = noOpObj,
}) => {
  const config = getHerkinConfig()
  const { proxy, vnc } = config.screencast

  if (SOCK_PROC) return SOCK_PROC

  const status = await statusSockify()

  if (status.pid) {
    Logger.pair(`- Websockify already running with pid:`, status.pid)
    return (SOCK_PROC = status)
  }

  Logger.log(`- Starting websockify server...`)
  SOCK_PROC = await childProc({
    cmd: 'websockify',
    args: flatUnion(
      [
        '-v',
        '--web',
        '/usr/share/novnc',
        `${proxy.host}:${proxy.port}`,
        `${vnc.host}:${vnc.port}`,
      ],
      args
    ),
    options: deepMerge(
      {
        detached: true,
        stdio: 'ignore',
        cwd: cwd || config.internalPaths.herkinRoot,
        env: { ...process.env },
      },
      options,
      { env }
    ),
    log: true,
  })

  return SOCK_PROC
}

/**
 * Stops the websockify server if it's running
 * If no reference exists, calls findProc to get a reference to the PID
 * @function
 * @public
 *
 * @return {Void}
 */
const stopSockify = async () => {
  SOCK_PROC
    ? killProc(SOCK_PROC)
    : await checkCall(async () => {
        const status = await statusSockify()
        status && status.pid && killProc(status)
      })

  SOCK_PROC = undefined
}

/**
 * Gets the status of the tiger vnc server
 *
 * @returns {Object} - Status of the tiger vnc process
 */
const statusSockify = async () => {
  const [_, status] = await limbo(findProc('websockify'))
  return status
}

module.exports = {
  statusSockify,
  startSockify,
  stopSockify,
}
