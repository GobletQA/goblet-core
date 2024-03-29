import { dispatch } from 'HKStore'
import { ActionTypes } from 'HKConstants'
import { Values } from 'HKConstants'
import { mapObj } from '@keg-hub/jsutils'

const { CATEGORIES, SIDEBAR_TYPES } = Values

/**
 *
 * @param {string} modalType - sidebar types from values.SIDEBAR_TYPES
 * @returns
 */
export const setActiveSidebar = (type = SIDEBAR_TYPES.FILE_TREE) => {
  mapObj(SIDEBAR_TYPES, (__, value) => {
    if (value === type) {
      dispatch({
        type: ActionTypes.SET_ITEMS,
        payload: {
          category: CATEGORIES.SIDEBAR,
          items: {
            activeId: type,
          },
        },
      })
    }
  })
}
