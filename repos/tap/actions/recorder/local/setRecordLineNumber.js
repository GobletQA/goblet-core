import { isObj } from '@keg-hub/jsutils'
import { dispatch, getStore } from 'HKStore'
import { Values, ActionTypes } from 'HKConstants'

const { CATEGORIES } = Values


/**
 * Gets the browser status from the server
 * @param {Object} data - Message data from the socket
 * @param {Object} testRunModel - The test run model to set running to false
 *
 * @returns {void}
 */
export const setRecordLineNumber = range => {
  if(!isObj(range))
    return console.warn(`Can not set line number, did not receive a valid range object`, message)

  const { items } = getStore().getState()
  const recorderActions = items[CATEGORIES.RECORDING_ACTIONS]

  dispatch({
    type: ActionTypes.UPSERT_ITEMS,
    payload: {
      category: CATEGORIES.RECORDING_ACTIONS,
      items: {
        ...recorderActions,
        range,
        // Subtract 1 because arrays start at 0
        lineNumber: range.startLineNumber - 1,
      },
    },
  })
}
