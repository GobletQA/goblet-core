import { getStore } from 'HKStore'
import { Values } from 'HKConstants'
import { setScreen } from './setScreen'
import { addToast } from '../toasts/addToast'

const { CATEGORIES, SUB_CATEGORIES, SCREENS } = Values

/**
 * Special handling to use the active screens activeFile be set for the reports screen
 * @type function
 * @param {Object} activeFile - File model of the active file
 *
 * @returns {void}
 */
export const setReportsScreen = activeFile => {
  if (!activeFile || activeFile.fileType !== Values.FILE_TYPES.REPORT)
    return addToast({
      type: 'error',
      message: `Tried to load file type ${activeFile.fileType} in the Reports Screen.`,
    })

  const { items } = getStore().getState()
  const reportsScreen = items[CATEGORIES.SCREENS][SCREENS.REPORTS]

  const screenModel = {
    ...reportsScreen,
    [SUB_CATEGORIES.ACTIVE_FILE]: activeFile || {},
  }

  setScreen(screenModel.id, screenModel)
}
