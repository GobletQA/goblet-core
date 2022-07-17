#!/usr/bin/env node
require('../../../resolveRoot')
const { Logger } = require('@keg-hub/cli-utils')
const { getGobletConfig } = require('@GSH/Config')
const { findProc, killProc } = require('@GSC/Libs/proc')
const { create: childProc } = require('@keg-hub/spawn-cmd/src/childProcess')
const {
  limbo,
  noOpObj,
  deepMerge,
  flatUnion,
  noPropArr,
} = require('@keg-hub/jsutils')

/**
 * Cache holder for the tigervnc process
 * @type {Object|undefined}
 */

/**
 * Starts tigervnc to allow loading VNC in the browser
 * @param {Object} args - options for setting up tigervnc
 * @param {Array} args.args - Arguments to pass to the Xtigervnc command
 * @param {Array} args.cwd - Location where the command should be run
 * @param {Array} args.env - Extra environment variables to pass
 *
 * @example
 * // With auth
 * Xtigervnc -SecurityTypes None -geometry 1440x900x24 -rfbauth /root/.vnc/passwd -rfbport 26370 -alwaysshared :0
 * @example
 * // With arm64 hack
 * LD_PRELOAD=/lib/aarch64-linux-gnu/libgcc_s.so.1 /usr/bin/Xtigervnc -SecurityTypes None -geometry 1440x900x24 -rfbport 26370 -alwaysshared :0
 *
 * @returns {Object} - Child process running tigervnc
 */
const startVNC = async ({
  args = noPropArr,
  cwd,
  options = noOpObj,
  env = noOpObj,
}) => {
  const status = await statusVNC()

  if (status.pid) {
    Logger.pair(`- Tigervnc already running with pid:`, status.pid)
    return status
  }

  Logger.log(`- Starting tigervnc server...`)
  const config = getGobletConfig()
  const { vnc } = config.screencast

  return await childProc({
    log: true,
    cmd: 'Xtigervnc',
    args: flatUnion(
      [
        `-verbose`,
        `-SecurityTypes`,
        `None`,
        '-geometry',
        `${vnc.width}x${vnc.height}x24`,
        `-rfbport`,
        vnc.port,
        `-alwaysshared`,
        vnc.display,
      ],
      args
    ),
    options: deepMerge(
      {
        detached: true,
        // stdio: 'ignore',
        cwd: cwd || config.internalPaths.gobletRoot,
        env: {
          ...process.env,
          DISPLAY: vnc.display,
          // Hack for arm64 machines to tigerVNC doesn't crash on client disconnect
          // This only happens on new Mac M1 machines using arm64
          // Ubuntu 20.10 should have a fix included, but playwright uses version 20.04
          // If the playwright docker image ever updates to +Ubuntu 20.10, this should be removed
          ...(process.arch === 'arm64' && {
            LD_PRELOAD: `/lib/aarch64-linux-gnu/libgcc_s.so.1`,
          }),
        },
      },
      options,
      { env }
    ),
  })
}

/**
 * Stops the websockify server if it's running
 * If no reference exists, calls findProc to get a reference to the PID
 *
 * @return {Void}
 */
const stopVNC = async () => {
  const status = await statusVNC()
  status && status.pid && killProc(status)
}

/**
 * Gets the status of the tiger vnc server
 *
 * @returns {Object} - Status of the tiger vnc process
 */
const statusVNC = async () => {
  const [_, status] = await limbo(findProc('Xtigervnc'))
  return status
}

module.exports = {
  statusVNC,
  startVNC,
  stopVNC,
}

require.main === module && startVNC(noOpObj)
