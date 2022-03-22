import { toBool } from '@keg-hub/jsutils'
const activeVNC = toBool(process.env.HERKIN_USE_VNC)

/**
 * Helper to check if in vnc mode
 */
export const isVNCMode = () => {
  return activeVNC
}
