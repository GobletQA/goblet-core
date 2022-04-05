import { useMemo } from 'react'
import { getScreencastUrl } from 'HKUtils/api/getScreencastUrl'

/**
 * Hook to dynamically build the novnc url
 * If VNC_ACTIVE is false, it returns an empty string
 *
 * @returns {string} - Built novnc url
 */
export const useScreencastUrl = () => {
  return useMemo(() => getScreencastUrl(), [])
}
