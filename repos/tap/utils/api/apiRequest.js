import { addToast } from 'HKActions/toasts'
import { isObj, get, noOpObj } from '@keg-hub/jsutils'
import { getBaseApiUrl } from './getBaseApiUrl'
import { gitAuthSignOut } from 'HKActions/admin'
import { networkRequest } from 'HKServices/networkRequest'
import { localStorage } from'HKUtils/storage/localStorage'

/**
 * Check the response from the API for an expired session
 * If expired, sign out and open the sign in modal by calling gitAuthSignOut
 * @param {boolean} success - True if the request was successful
 * @param {number} statusCode - Response code returned from the Backend API
 * @param {string} message - Response message returned from the Backend API
 * @param {boolean} showAlert - Should show failed alert message
 */
const isValidSession = async (success, statusCode, message, showAlert) =>{
  if(success || statusCode !== 401) return true

  showAlert &&
    addToast({ type: 'warn', message: message || `User session is expired, please sign in` })

  await gitAuthSignOut()
}

/**
 * Pull the JWT from local storage and add it as a Bearer token
 * Is only added if it exists
 * @param {Object} headers - Existing headers to add to the request
 *
 * @return {Object} - Built headers object, with the JWT added if it exists
 */
const addHeaders = async (headers=noOpObj) => {
  const jwt = await localStorage.getJwt()
  return {
    ...headers,
   ...(jwt && { Authorization: `Bearer ${jwt}` })
  }
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
  builtRequest.headers = await addHeaders(builtRequest.headers)

  const { data, success, statusCode, errorMessage } = await networkRequest(
    builtRequest
  )

  
  await isValidSession(
    success,
    statusCode,
    get(data, 'message', errorMessage),
    !builtRequest.url.endsWith(`/repo/status`)
  )

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
