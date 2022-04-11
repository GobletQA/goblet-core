import { dispatch, getStore } from 'HKStore'
import { Values, ActionTypes } from 'HKConstants'
import { isEmptyColl } from '@keg-hub/jsutils'

const { CATEGORIES, SUB_CATEGORIES } = Values

/**
 * TODO: @lance-tipton - it would be better is screens just kept a reference to the active File
 * Then use an activeFile store, where the file info is only kept in a single location
 * All interactions with the file would happen there
 * Doing this, would remove the need to this action, and probably fix other bugs as well
 */

/**
 * Checks each screen to see if the updatedFile is active on that screen
 * If it is, then it update active file with passed in updatedFile
 * @param {Object} updatedFile - Updated active file
 */
export const updateAllScreensActiveFile = (updatedFile, screenId) => {
  const { items } = getStore().getState()
  Object.values(items[CATEGORIES.SCREENS])
    .forEach(screen => {
      const current = screen[SUB_CATEGORIES.ACTIVE_FILE]

      screen.id !== screenId &&
        !isEmptyColl(current) &&
        current.uuid === updatedFile.uuid &&
        dispatch({
          type: ActionTypes.SET_ITEM,
          payload: {
            category: CATEGORIES.SCREENS,
            key: screen.id,
            item: {
              ...screen,
              [SUB_CATEGORIES.ACTIVE_FILE]: updatedFile,
            },
          },
        })
    })
}

