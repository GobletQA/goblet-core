#!/usr/bin/env node
require('../resolveRoot')
const { Logger } = require('@keg-hub/cli-utils')
const { noOpObj, exists, wait, get } = require('@keg-hub/jsutils')
const { checkArgs } = require('@GSC/Libs/utils/checkArgs')
const { daemonize } = require('@GSC/Libs/utils/daemonize')
const {
  stopServer,
  statusServer,
  statusBrowser,
} = require('@GSC/Playwright')
const {
  statusSockify,
  startSockify,
  stopSockify,
  statusVNC,
  startVNC,
  stopVNC,
} = require('@GSC/Libs/vnc')

/**
 * Helper method to get the PId of the screencast servers
 * @function
 * @private
 *
 * @returns {Void}
 */
const getPid = async (args) => {
  
  const status = await statusScreencast()
  
  const type = Boolean(args.find(_arg => _arg.includes(`--soc`) ||_arg.includes(`=soc`)))
    ? `sockify`
    : `vnc`

  const pid = get(status, `${type}.pid`)
  pid && console.log(pid)

  process.exit(0)
}

/**
 * Helper method to kill the running process
 * @function
 * @private
 *
 * @returns {Void}
 */
const stopScreencast = async () => {
  await stopServer()
  await stopSockify()
  await stopVNC()

  Logger.info(`[ ScreenCast ] Processes have been terminated!\n`)
}

/**
 * Kills and exists the running ScreenCast processes
 * @function
 * @private
 * @param {number|string} - Exit status for the current node process
 *
 * @returns {Void}
 */
const killAndExit = exitStatus => {
  return stopScreencast()
    .then(() => {
      return 0
    })
    .catch(err => {
      Logger.error(err.stack)
      return 1
    })
    .finally((status = 0) =>
      process.exit(exists(exitStatus) ? exitStatus : status)
    )
}

/**
 * Listen for "(cmd|ctrl) + c" keyboard events, and exit the running process
 * Calling exit should automatically kill all child processes
 * Used when servers are not started in detached mode, must be explicity set
 * @function
 * @private
 * @param {string|number} - Exit status of the process
 *
 * @returns {Void}
 */
const handleOnExit = exitStatus => {
  // Array.from([
  //   'SIGBREAK',
  //   'SIGINT',
  //   'SIGUSR1',
  //   'SIGUSR2',
  //   'uncaughtException',
  //   'SIGTERM',
  // ])
  // .map(type => process.on(type, exitCode => stopScreencast(exitCode || exitStatus || 0)))
}

/**
 * Checks if the status argument is passed
 * If it is, it calls the status, and prints it
 * @exists
 *
 * @return {Void}
 */
const checkStatus = async () => {
  const status = await statusScreencast()

  // TODO: print this in a nice format
  console.log(status)

  process.exit(0)
}

/**
 * Gets the current status of the screencast processes
 *
 * @return {Object} - Contains status for screencast processes
 */
const statusScreencast = async (params = noOpObj) => {
  const status = {}
  status.vnc = await statusVNC()
  status.sockify = await statusSockify()
  status.server = await statusServer()

  if (params.browser) status.browser = await statusBrowser(params.browser)

  return status
}

/**
 * Restarts all screencast servers, then exists the process
 * @function
 * @public
 * @exits
 * @param {Object} params
 * @param {Object} params.vnc - Config used when starting the vnc server
 * @param {Object} params.sockify - Config used when starting the websockify novnc server
 * @param {Object} params.playwright - Config used when starting the browser via playwright
 *
 * @returns {Void}
 */
const restartScreencast = async params => {
  Logger.info(`\n[ ScreenCast ] Restarting servers...`)
  await stopScreencast()
  await wait(2000)
  await startScreencast({ ...params, __internal: true })
  process.exit(0)
}

/**
 * Starts the vnc and novnc servers running in the background. Then starts the browser
 * @function
 * @public
 *
 * @param {Object} params
 * @param {Object} params.vnc - Config used when starting the vnc server
 * @param {Object} params.sockify - Config used when starting the websockify novnc server
 * @param {Object} params.playwright - Config used when starting the browser via playwright
 * @param {boolean} exitListener - Should the process be killed on SIGINT
 *
 * @returns {Object} - Contains the browser, context, page, and child process of the servers
 */
const startScreencast = async params => {
  const {
    args,
    __internal,
    exitListener,
    vnc = noOpObj,
    sockify = noOpObj,
  } = params

  // Ensure this call comes before the potential daemon call
  // That way all process will exit when the daemon exists
  // Setup listener to kill process on exit
  exitListener && handleOnExit()

  // Parses the passed in args
  // Checks if a a method should be called based on the arg
  !__internal &&
    (await checkArgs(args, {
      pid: getPid,
      kill: killAndExit,
      daemon: daemonize,
      status: checkStatus,
      restart: () => restartScreencast(params),
    }))

  Logger.info(`\n[ ScreenCast ] Starting servers...`)
  // Start the VNC, websockify servers
  await startVNC(vnc)
  await startSockify(sockify)
  Logger.info(`[ ScreenCast ] Servers started successfully\n`)

  // Return the current status of the servers
  return {
    vnc: await statusVNC(),
    sockify: await statusSockify(),
  }
}

/**
 * If the module is called directly, just call screencast
 * Otherwise export the screenCase and process methods
 */
require.main === module
  ? startScreencast({ exitListener: true })
  : (module.exports = {
      stopScreencast,
      statusScreencast,
      startScreencast,
      restartScreencast,
    })
