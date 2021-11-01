const { toBool }  = require('@keg-hub/jsutils')
const { Logger }  = require('@keg-hub/cli-utils')


/**
 * Gets the values for the vnc env and socket env
 *
 * @returns {Object<boolean>} - Contains the boolean values of vnc env and socket env
 */
const checkVncEnv = () => ({
  vncActive: toBool(process.env.HERKIN_USE_VNC),
  socketActive: toBool(process.env.HERKIN_PW_SOCKET)
})


/**
 * Sets the envs for using VNC inside docker, or the host machine websocket
 * for displaying the browser
 *
 * @param {boolean} vncActive - True if VNC should be used instead of the host websocket
 *
 * @returns {boolean} - True if VNC should be used instead of the host websocket
 */
const setVncENV = (vncActive) => {
  process.env.HERKIN_USE_VNC = Boolean(vncActive)
  // Using the browser websocket should be the inverse of using VNC
  process.env.HERKIN_PW_SOCKET = !vncActive

  vncActive && Logger.info(`Using docker VNC to render browser tests`)

  return vncActive
}

module.exports = {
  checkVncEnv,
  setVncENV
}