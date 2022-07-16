import { Values } from 'HKConstants'
import { noOpObj } from '@keg-hub/jsutils'
import { useActiveFile } from './useActiveFile'
import { useStoreItems } from 'HKHooks/store/useStoreItems'

const { CATEGORIES } = Values

/**
 * Get the currently active test runs for the activeFile
 *
 * @returns {Object} - Found active test runs
 */
export const useActiveTestRuns = () => {
  const activeFile = useActiveFile()
  const allTestRuns = useStoreItems(CATEGORIES.TEST_RUNS) || noOpObj

  return activeFile &&
    activeFile.location &&
    allTestRuns[activeFile.location]
}
