import { getStore } from 'HKStore'
import { Values } from 'HKConstants'
import { noOpObj } from '@keg-hub/jsutils'
import { WSService } from 'HKServices/socketService'

const { SOCKR_MSG_TYPES } = Values

/**
 * Gets the browser status from the server
 * @param {Object} data - Message data from the socket
 * @param {Object} testRunModel - The test run model to set running to false
 *
 * @returns {void}
 */
export const setRecorderStatus = (options = noOpObj) => {
  WSService.emit(SOCKR_MSG_TYPES.BROWSER_RECORDER, options)
}
