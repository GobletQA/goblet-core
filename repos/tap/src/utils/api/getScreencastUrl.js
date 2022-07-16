import { Values } from 'HKConstants'
import { getBaseApiUrl } from 'HKUtils/api/getBaseApiUrl'
const { VNC_ACTIVE } = Values

/**
 * Returns the generated screencast url if VNC_ACTIVE is active
 */
export const getScreencastUrl = () => {
  if(!VNC_ACTIVE) return ``

  const base = getBaseApiUrl()
  const { host } = new URL(base)
  const { protocol } = new URL(window.location.origin)
  const proto = protocol.includes('https') ? 'wss' : 'ws'

  return `${proto}://${host}/novnc`
}