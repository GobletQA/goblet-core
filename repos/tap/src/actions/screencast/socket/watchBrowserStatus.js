import { dispatch, getStore } from 'HKStore'
import { Values } from 'HKConstants'
import { addToast } from 'HKActions/toasts'
import { noOpObj, get } from '@keg-hub/jsutils'
import { WSService } from 'HKServices/socketService'
import { setBrowserStatus } from '../local/setBrowserStatus'

const { CATEGORIES, SOCKR_MSG_TYPES } = Values

/**
 * Gets the browser status from the server
 * @param {Object} data - Message data from the socket
 * @param {Object} testRunModel - The test run model to set running to false
 *
 * @returns {void}
 */
export const watchBrowserStatus = (options = noOpObj) => {
  const { items } = getStore()?.getState()
  if (!items) return console.warn(`No items set in the store`)

  WSService.emit(SOCKR_MSG_TYPES.BROWSER_STATUS, {
    ...items[CATEGORIES.BROWSER_OPTS],
    ...noOpObj,
  })
}
