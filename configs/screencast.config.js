const { toBool } = require('@keg-hub/jsutils')

const {
  GOBLET_USE_VNC,
  DISPLAY = ':0.0',
  NO_VNC_PORT = 26369,
  SCREENCAST_PROXY_HOST,
  VNC_VIEW_HEIGHT = 900,
  VNC_VIEW_WIDTH = 1440,
  VNC_SERVER_PORT = 26370,
  SCREENCAST_API_PORT = 5006,
  VNC_PROXY_HOST = SCREENCAST_PROXY_HOST,
} = process.env


const screenDims = {
  width: parseInt(VNC_VIEW_WIDTH, 10) ?? 900,
  height: parseInt(VNC_VIEW_HEIGHT, 10) ?? 1440,
}

const screencastConfig = {
  // Set if the screencast is active or not
  active: toBool(GOBLET_USE_VNC),
  // Proxy settings, for connecting the backend API to the noVNC server
  proxy: {
    path: '/novnc',
    port: NO_VNC_PORT,
    host: VNC_PROXY_HOST,
  },
  // Uses to start separate screencast API
  server: {
    host: SCREENCAST_PROXY_HOST,
    port: SCREENCAST_API_PORT,
  },
  vnc: {
    display: DISPLAY,
    host: VNC_PROXY_HOST,
    port: VNC_SERVER_PORT,
    width: VNC_VIEW_WIDTH,
    height: VNC_VIEW_HEIGHT,
  },
  // Default playwright context settings
  context: {
    screen: screenDims,
    viewport: screenDims,
  },
  // Default playwright browser launch settings
  // TODO: add defaults here for Screencast
  browser: {},
}

module.exports = {
  screencastConfig,
}
