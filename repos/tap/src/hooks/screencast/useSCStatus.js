import { useEffect, useRef } from 'react'
import { Values } from 'HKConstants'
import { useStoreItems } from 'HKHooks/store/useStoreItems'
import { getSCStatus } from 'HKActions/screencast/api/getSCStatus'

const { CATEGORIES } = Values

/**
 * Helper to get the current status of the screencast servers
 * Calls the action which calls the backend API
 *
 * @returns {Object} - Current Screencast server status
 */
export const useSCStatus = () => {
  const scOpts = useStoreItems(CATEGORIES.SCREENCAST_STATUS)
  const lastCheckRef = useRef()

  useEffect(() => {
    ;(async () => {
      if (lastCheckRef.current === scOpts?.lastCheck) return

      const resp = await getSCStatus()
      resp?.lastCheck && (lastCheckRef.current = resp?.lastCheck)
    })()
  }, [scOpts, lastCheckRef.current])

  return scOpts
}
