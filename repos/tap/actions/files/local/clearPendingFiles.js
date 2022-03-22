import { dispatch } from 'HKStore'
import { Values, ActionTypes } from 'HKConstants'

const { CATEGORIES } = Values

/**
 * sets the currently activeFile as an item in pendingFiles. given a valid pendingContent
 * @param {string} pendingContent - Modified content that's not saved
 * @param {Object} activeFile - The file with pending content
 *
 * @returns {void}
 */
export const clearPendingFiles = () => {
  dispatch({
    type: ActionTypes.SET_ITEMS,
    payload: {
      category: CATEGORIES.PENDING_FILES,
      items: {},
    },
  })
}
