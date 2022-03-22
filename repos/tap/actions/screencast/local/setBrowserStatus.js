import { dispatch, getStore } from 'HKStore'
import { Values, ActionTypes } from 'HKConstants'
import { noOpObj, isObj } from '@keg-hub/jsutils'

const { CATEGORIES } = Values

/**
 * Updates the store with the passed in browser status
 *
 * @returns {Void}
 */
export const setBrowserStatus = (status = noOpObj) => {
  const { items } = getStore()?.getState()
  const currStatus = items[CATEGORIES.SCREENCAST_STATUS] || noOpObj
  // Pull the lastCheck prop from status, because it should be set a level higher
  // I.E. storeStatus = { lastCheck, browser: { ....updated status }}
  const { lastCheck, ...update } = status

  isObj(status) &&
    dispatch({
      type: ActionTypes.SET_ITEMS,
      payload: {
        category: CATEGORIES.SCREENCAST_STATUS,
        items: {
          ...currStatus,
          lastCheck: lastCheck || new Date().getTime(),
          browser: update,
        },
      },
    })
}
