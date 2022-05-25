import { useMemo } from 'react'
import { Values } from 'HKConstants'
import { noOpObj } from '@keg-hub/jsutils'
import { useStoreItems } from 'HKHooks/store/useStoreItems'

const { CATEGORIES } = Values

/**
 * Hook to memoize if the activeFile has pending content
 * @param {boolean} checkPending - If pending content should be checked
 * @param {string} location - Location property of the activeFile
 *
 * @returns {boolean} - If the activeFile has pending content
 */
export const usePendingCheck = (checkPending, location) => {
  const { pendingFiles = noOpObj } = useStoreItems([CATEGORIES.PENDING_FILES])
  const pendingContent = pendingFiles[location]

  return useMemo(
    () => checkPending && pendingContent,
    [checkPending, pendingContent]
  )
}
