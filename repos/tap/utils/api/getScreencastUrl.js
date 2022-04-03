import { Values } from 'HKConstants'
import { getBaseApiUrl, isSecureHost } from 'HKUtils/api/getBaseApiUrl'
const { HOST, PORT, VNC_ACTIVE } = Values.VNC_CONFIG

const base = getBaseApiUrl()
const { host } = new URL(base)
const protocol = isSecureHost() ? `wss` : `ws`

const screencastUrl = `${protocol}://${HOST || host}${PORT ? ':' + PORT : ''}/novnc`

/**
 * Returns the generated screencast url if VNC_ACTIVE is active
 */
export const getScreencastUrl = () => {
  return VNC_ACTIVE ? screencastUrl : ''
}