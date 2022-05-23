import { isDev } from '../isDev'
import { Values } from 'HKConstants'
import { getBaseApiUrl } from 'HKUtils/api/getBaseApiUrl'
const { HOST, PORT, VNC_ACTIVE } = Values.VNC_CONFIG

/**
 * Returns the generated screencast url if VNC_ACTIVE is active
 */
export const getScreencastUrl = () => {
  const base = getBaseApiUrl()
  const { host } = new URL(base)
  const { protocol } = new URL(window.location.origin)
  const proto = protocol.includes('https') ? 'wss' : 'ws'
  const screencastUrl = `${proto}://${HOST || host}${isDev && PORT ? ':' + PORT : ''}/novnc`
  return VNC_ACTIVE ? screencastUrl : ''
}