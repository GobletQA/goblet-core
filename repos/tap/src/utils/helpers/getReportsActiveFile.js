import { Values } from 'HKConstants'
import { getStore } from 'HKStore'
import { getActiveFile } from './getActiveFile'

const { CATEGORIES, SCREENS } = Values

/**
 * Gets the active reports file, or the active screen activeFile
 * @param {Object} items - Redux store items containing the features and activeData
 *
 * @returns {Object} - fileModel of the activeFile for the reports screen
 */
export const getReportsActiveFile = items => {
  const storeItems = items || getStore()?.getState()?.items
  const reportsScreen = storeItems[CATEGORIES.SCREENS][SCREENS.REPORTS]
  return reportsScreen?.activeFile?.location
    ? reportsScreen.activeFile
    : getActiveFile(items)
}
