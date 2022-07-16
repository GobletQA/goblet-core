import { dispatch, getStore } from 'HKStore'
import { Values, ActionTypes } from 'HKConstants'
import { noOpObj, isObj } from '@keg-hub/jsutils'

const { CATEGORIES } = Values

/**
 * Updates the store with the passed in status
 *
 * @returns {Object} - Resposne from the backend API
 */
export const setSCStatus = status => {
  const { items } = isObj(status) ? getStore()?.getState() : noOpObj
  const currOpts = items[CATEGORIES.SCREENCAST_STATUS] || noOpObj

  status &&
    items &&
    dispatch({
      type: ActionTypes.SET_ITEMS,
      payload: {
        category: CATEGORIES.SCREENCAST_STATUS,
        items: {
          lastCheck: status.lastCheck,
          browser: {
            ...currOpts.browser,
            ...status.browser,
          },
          server: {
            ...currOpts.server,
            ...status.server,
          },
          vnc: {
            ...currOpts.vnc,
            ...status.vnc,
          },
          sockify: {
            ...currOpts.sockify,
            ...status.sockify,
          },
        },
      },
    })
}
