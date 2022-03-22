import { useMemo } from 'react'
import { Values } from 'HKConstants'
import { noOpObj } from '@keg-hub/jsutils'
import { useStoreItems } from 'HKHooks/store/useStoreItems'
const { CATEGORIES, SUB_CATEGORIES } = Values

/**
 * Hook to get the activeFile from the currently active screen
 * @function
 * @param {string} screenId - Id of the screen the file is active on
 *
 * @returns {Object} - Found active file
 */
export const useActiveFile = screenId => {
  const screenModels = useStoreItems(CATEGORIES.SCREENS)

  return useMemo(() => {
    return screenId
      ? screenModels[screenId][SUB_CATEGORIES.ACTIVE_FILE]
      : (Object.values(screenModels).find(model => model.active) || noOpObj)[SUB_CATEGORIES.ACTIVE_FILE]
  }, [screenModels, screenId])
}
