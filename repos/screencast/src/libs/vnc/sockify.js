#!/usr/bin/env node
require('../../../resolveRoot')
const fs = require('fs')
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
  const config = getGobletConfig()
  const { proxy, vnc } = config.screencast

  const status = await statusSockify()

  if (status.pid) {
    Logger.pair(`- Websockify already running with pid:`, status.pid)
    return status
  }

  const creds = {
    key: process.env.KEG_PROXY_PRIVATE_KEY,
    cert: process.env.KEG_PROXY_CERT,
    ca: process.env.KEG_PROXY_CA,
  }

  const credentials = Object.entries(creds).reduce((conf, [key, loc]) => {
    fs.existsSync(loc) && (conf[key] = creds[key])

    return conf
  }, {})

  const wssArgs = credentials.cert && credentials.key
    ? [`--cert=${credentials.cert}`, `--key=${credentials.key}`]
    : []

  Logger.log(`- Starting websockify server...`)
  return await childProc({
    cmd: 'websockify',
    args: flatUnion(
      [
        '-v',
        ...wssArgs,
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
        // stdio: 'ignore',
        cwd: cwd || config.internalPaths.gobletRoot,
        env: { ...process.env },
      },
      options,
      { env }
    ),
    log: true,
  })
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
  const status = await statusSockify()
  status && status.pid && killProc(status)
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

require.main === module && startSockify(noOpObj)
