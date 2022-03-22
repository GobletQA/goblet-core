import { useCallback } from 'react'
import { Values } from 'HKConstants'
import { useStoreItems } from 'HKHooks/store/useStoreItems'
import { setScreenById } from 'HKActions/screens/setScreenById'
import { findRelatedReport } from 'HKUtils/fileTree/findRelatedReport'
import { isArr, exists, isEmpty, noOpObj, noPropArr } from '@keg-hub/jsutils'

const { CATEGORIES, SCREENS } = Values

/**
 * Gets the activeFile for the new screen
 * By using the passed in switchFile if it exists, or using the current screens activeFile
 * @param {Object} switchToFile - Active file of the screen being set to active
 * @param {Object} currentActiveFile - Active file of the current screen
 *
 * @return {Object} - Active file to use for the screen being switched to
 */
const getScreenFile = (currentActiveFile, switchToFile) => {
  return exists(currentActiveFile) &&
    (!exists(switchToFile) || isEmpty(switchToFile))
    ? currentActiveFile
    : switchToFile
}

/**
 * Checks if the active file can be reused by the tab being switched to
 * @param {Object} activeFile - Currently active file
 * @param {Object} switchTab - Tab being switched to
 *
 * @returns {boolean} - True if the activeFile can be reused
 */
const reuseActive = (activeFile, switchTab) => {
  return (
    activeFile &&
    isArr(switchTab.fileTypes) &&
    switchTab.fileTypes.includes(activeFile.fileType)
  )
}

/**
 * Finds the activeFile to use for the new screen
 * Checks if current activeFile can be reused
 * If not, then searches for a relative file
 * @param {Object} switchScreen - Screen model that will become active
 * @param {Object} screenTab - Currently active Screen Tab
 * @param {Object} switchTab - Screen Tab that will become active
 * @param {Object} fileTree - Tree of all fileTree nodes currently loaded
 *
 * @returns {Object|undefined} - Found activeFile or undefined
 */
const findActiveFile = async (switchScreen, screenTab, switchTab, fileTree) => {
  // Get the activeFiles to use for the switched to screen
  // If no active file is set, it uses the current screens activeFiles
  const activeFile = getScreenFile(
    screenTab.activeFile,
    switchScreen.activeFile
  )

  // Check if the activeFile should be reused
  const reuseActiveFile = reuseActive(activeFile, switchTab)

  // If we can't reuse the file,
  // And switching to report screen, find a relative report
  return reuseActiveFile
    ? activeFile
    : // If switching to the report screen, and no current activeFile
      // Then try to find the most recent report file and load it
      switchScreen.id === SCREENS.REPORTS &&
        (await findRelatedReport(screenTab.activeFile, fileTree.nodes))
}

/**
 * Hook that creates a callback that's called when a tab is selected
 * Gets the tab that was selected, and calls setScreenById action to set it active
 * Also checks if it has a active files, and if not uses the current screens active files
 * @type function
 * @param {Object} screenTab - Currently active Screen Tab
 * @param {Object} screenModels - All screen models from the Redux Store referenced by Screen ID
 *
 * @returns {function} - To be called when a screen tab is selected
 */
export const useScreenSelect = (
  screenTab,
  screenModels,
  screenTabs = noPropArr
) => {
  const { fileTree = noOpObj } = useStoreItems([CATEGORIES.FILE_TREE])
  return useCallback(
    async screenId => {
      const switchScreen = screenModels[screenId]
      if (screenId === screenTab?.id || !switchScreen) return

      // Get the screen tab that has extra metadata for the screen
      const switchTab = screenTabs.find(tab => tab.id === screenId)
      const activeFile = await findActiveFile(
        switchScreen,
        screenTab,
        switchTab,
        fileTree
      )

      // Add the previous activeFile if it's allowed
      const screen = activeFile ? { ...switchScreen, activeFile } : switchScreen

      // Call action to update the Redux store with the new active screen
      setScreenById(screenId, screen)

      return true
    },
    [screenTab, screenTabs, screenModels, fileTree.nodes]
  )
}
