import { toBool } from '@keg-hub/jsutils'
const activeVNC = toBool(process.env.GB_VNC_ACTIVE)

/**
 * Helper to check if in vnc mode
 */
export const isVNCMode = () => {
  return activeVNC
}
