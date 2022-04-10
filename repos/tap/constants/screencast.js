import { isVNCMode } from 'HKUtils/isVNCMode'
import { deepFreeze } from '@keg-hub/jsutils'

const activeVNC = isVNCMode()

export const screencast = deepFreeze({
  VNC_CONFIG: {
    HOST: process.env.HERKIN_SERVER_HOST,
    PORT: process.env.NO_VNC_PORT || 26369,
    VNC_ACTIVE: activeVNC,
    SOCKET_ACITVE: !activeVNC,
  },
  SCREENCAST_DEFAULTS: {
    lastCheck: false,
  },
  BROWSER_DEFAULTS: {
    restart: true,
    // TODO: Add browser options here
  },
  RECORD_ACTIONS: {
    STOP:`stop`,
    START:`start`,
  }
})
