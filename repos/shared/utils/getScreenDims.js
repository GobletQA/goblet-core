const { toNum } = require('@keg-hub/jsutils')

/**
 * Gets the screen dimensions from the current ENV
 * Uses HERKIN_CONTEXT_WIDTH && HERKIN_CONTEXT_HEIGHT envs first
 * 
 * @returns {Object} - Screen Dims Object
 */
const getScreenDims = () => {
  const {
    VNC_VIEW_WIDTH = 1440,
    VNC_VIEW_HEIGHT = 900,
    HERKIN_CONTEXT_WIDTH=VNC_VIEW_WIDTH,
    HERKIN_CONTEXT_HEIGHT=VNC_VIEW_HEIGHT,
  } = process.env

  return {
    width: toNum(HERKIN_CONTEXT_WIDTH) || 1440,
    height: toNum(HERKIN_CONTEXT_HEIGHT) || 900,
  }
}

module.exports = {
  getScreenDims
}