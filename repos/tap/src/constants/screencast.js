import { isVNCMode } from 'HKUtils/isVNCMode'
import { deepFreeze } from '@keg-hub/jsutils'

const activeVNC = isVNCMode()

export const screencast = deepFreeze({
  VNC_ACTIVE: activeVNC,
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
  },
  PLAY_ACTIONS: {
    STOP:`stop`,
    START:`start`,
  }
})
