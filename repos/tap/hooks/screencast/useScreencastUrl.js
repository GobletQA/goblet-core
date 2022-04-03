import { useMemo } from 'react'
import { Values } from 'HKConstants'
import { getBaseApiUrl } from 'HKUtils/api/getBaseApiUrl'

const { HOST, PORT, VNC_ACTIVE } = Values.VNC_CONFIG

/**
 * Hook to dynamically build the novnc url
 * If VNC_ACTIVE is false, it returns an empty string
 *
 * @returns {string} - Built novnc url
 */
export const useScreencastUrl = () => {
  return useMemo(() => {
    // TODO: move this to a utility helper
    if (!VNC_ACTIVE) return ``

    const base = getBaseApiUrl()
    const { host, protocol } = new URL(base)

    return `wss://${host}/novnc`
  }, [])
}
