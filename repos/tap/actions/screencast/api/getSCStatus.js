import { dispatch, getStore } from 'SVStore'
import { devLog } from 'SVUtils'
import { Values } from 'SVConstants'
import { noOpObj, objToQuery } from '@keg-hub/jsutils'
import { apiRequest } from 'SVUtils/api/apiRequest'
import { setSCStatus } from 'SVActions/screencast/local/setSCStatus'

const { HttpMethods, CATEGORIES } = Values

/**
 * Calls the backend API to get the status of the screencast processes
 * Updates the store with the response
 * 
 * @returns {Object} - Response from the backend API
 */
export const getSCStatus = async (options=noOpObj) => {
  const { items } = getStore()?.getState()
  if(!items)
    return console.warn(`No items set in the store`)
  
  const browserOpts = items[CATEGORIES.BROWSER_OPTS]

  const resp = await apiRequest({
    url: '/screencast/status',
    method: HttpMethods.GET,
    params: {
      browser: {
        ...browserOpts,
        ...options.browser
      },
    },
  }, 'object')

  resp && setSCStatus(resp)

  return resp
}