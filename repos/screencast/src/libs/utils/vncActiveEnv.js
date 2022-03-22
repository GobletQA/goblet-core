const { toBool } = require('@keg-hub/jsutils')
const { Logger } = require('@keg-hub/cli-utils')

/**
 * Gets the values for the vnc env and socket env
 *
 * @returns {Object<boolean>} - Contains the boolean values of vnc env and socket env
 */
const checkVncEnv = () => ({
  vncActive: toBool(process.env.HERKIN_USE_VNC),
  socketActive: toBool(process.env.HERKIN_PW_SOCKET),
})


/**
 * Adds and removes envs from the current process
 * @param {string} toAdd - Name of the env to add to the current process
 * @param {string} toRemove - Name of the env to remove from the current process
 * 
 * @returns {Void}
*/
const envUpdates = (toAdd, toRemove) => {
  delete process.env[toRemove]
  process.env[toAdd] = true
}

/**
 * Sets the envs for using VNC inside docker, or the host machine websocket
 * for displaying the browser
 *
 * @param {boolean} vncActive - True if VNC should be used instead of the host websocket
 *
 * @returns {boolean} - True if VNC should be used instead of the host websocket
 */
const setVncENV = vncActive => {

  vncActive
    ? envUpdates(`HERKIN_USE_VNC`, `HERKIN_PW_SOCKET`)
    : envUpdates(`HERKIN_PW_SOCKET`, `HERKIN_USE_VNC`)

  vncActive
    ? Logger.highlight(`Using`, `VNC in Docker`, `for browser automation`)
    : Logger.info(`Using`, `Host Machine`, `for browser automation`)

  return vncActive
}

module.exports = {
  checkVncEnv,
  setVncENV,
}
