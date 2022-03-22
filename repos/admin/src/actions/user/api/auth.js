import { Values } from 'HKConstants'
import { WSService } from 'HKServices/socketService'
const { SOCKR_MSG_TYPES } = Values

/**
 * Gets the browser status from the server
 * @param {Object} data - Message data from the socket
 * @param {Object} testRunModel - The test run model to set running to false
 *
 * @returns {void}
 */
export const auth = options => {
  WSService.emit(SOCKR_MSG_TYPES.AUTH_TOKEN, options)
}
