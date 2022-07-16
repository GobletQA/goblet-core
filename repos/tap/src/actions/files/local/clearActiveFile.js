import { dispatch, getStore } from 'HKStore'
import { Values, ActionTypes } from 'HKConstants'
import { getActiveScreen } from 'HKUtils/helpers/getActiveScreen'
const { CATEGORIES, SUB_CATEGORIES } = Values

/**
 * Clears a currently set active fileModel
 * @type function
 * @param {Object} screenId - Id of the screen to set the fileModel as the activeFile
 *
 * @returns {void}
 */
export const clearActiveFile = screenId => {
  const { items } = getStore().getState()
  const screenModel = getActiveScreen(items, screenId)

  screenModel &&
    dispatch({
      type: ActionTypes.SET_ITEM,
      payload: {
        category: CATEGORIES.SCREENS,
        key: screenModel.id,
        item: {
          ...screenModel,
          [SUB_CATEGORIES.ACTIVE_FILE]: false,
        },
      },
    })
}
