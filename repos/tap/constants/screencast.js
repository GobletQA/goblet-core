import { toBool } from '@keg-hub/jsutils'

export const screencast = {
  VNC_CONFIG: {
    HOST: process.env.SERVER_HOST,
    PORT: process.env.NO_VNC_PORT || 26369,
    VNC_ACTIVE: toBool(process.env.HERKIN_USE_VNC),
    SOCKET_ACITVE: toBool(process.env.HERKIN_PW_SOCKET),
  },
  SCREENCAST_DEFAULTS: {
    lastCheck: false,
  },
  BROWSER_DEFAULTS: {
    restart: true,
    // TODO: Add browser options here
  }
}