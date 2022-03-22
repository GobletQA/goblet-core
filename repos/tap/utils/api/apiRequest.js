import { addToast } from 'HKActions/toasts'
import { isObj, get } from '@keg-hub/jsutils'
import { getBaseApiUrl } from './getBaseApiUrl'
import { gitAuthSignOut } from 'HKActions/admin'
import { networkRequest } from 'HKServices/networkRequest'

/**
 * Check the response from the API for an expired session
 * If expired, sign out and open the sign in modal by calling gitAuthSignOut
 * @param {boolean} success - True if the request was successful
 * @param {number} statusCode - Response code returned from the Backend API
 * @param {string} message - Response message returned from the Backend API
 */
const isValidSession = async (success, statusCode, message) =>{
  if(success || statusCode !== 401) return true

  addToast({
    type: 'warn',
    message: message || `User session is expired, please sign in`,
  })

  await gitAuthSignOut()
}

/**
 * Helper to make api requests to the Backend API
 * @function
 * @export
 * @public
 * @param {Object} request - Arguments that define the request type to make
 *
 * @returns {Object|Boolean} - Data returned from the Backend API or false
 */
export const apiRequest = async request => {
  const builtRequest = isObj(request) ? { ...request } : { url: request }

  builtRequest.url =
    builtRequest.url.indexOf('/') !== 0
      ? builtRequest.url
      : `${getBaseApiUrl()}${builtRequest.url}`

  // Add to ensure cookies get sent with the requests
  builtRequest.withCredentials = true

  const { data, success, statusCode, errorMessage } = await networkRequest(
    builtRequest
  )

  await isValidSession(success, statusCode, get(data, 'message', errorMessage))

  return success
    ? { 
        data,
        success,
        statusCode,
      }
    : {
        data,
        success,
        statusCode,
        error: data.message || errorMessage,
      }
}
