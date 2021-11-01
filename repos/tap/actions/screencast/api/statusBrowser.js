import { dispatch, getStore } from 'SVStore'
import { devLog } from 'SVUtils'
import { Values } from 'SVConstants'
import { addToast } from 'SVActions/toasts'
import { noOpObj, get } from '@keg-hub/jsutils'
import { apiRequest } from 'SVUtils/api/apiRequest'
import { setBrowserStatus } from '../local/setBrowserStatus'
import { getActiveScreen } from 'SVUtils/helpers/getActiveScreen'

const { HttpMethods, CATEGORIES, SCREENS } = Values

/**
 * Calls the backend API to get the browser status
 * Then calls setBrowser status with the response
 * @param {Object} options - Custom options to pass to the backend API
 *
 * @return {Object} - Backend API response 
 */
export const statusBrowser = async (options=noOpObj) => {

  const { items } = getStore()?.getState()
  if(!items)
    return console.warn(`No items set in the store`)
  
  // Ensure we are on the Screencast screen
  // If we are not, we don't care about browser status
  const activeScreen = getActiveScreen(items)
  const screencastActive = activeScreen.id === SCREENS.SCREENCAST
  if(activeScreen.id !== SCREENS.SCREENCAST) return noOpObj
  
  const currStatus = items[CATEGORIES.SCREENCAST_STATUS]
  const storeOpts = items[CATEGORIES.BROWSER_OPTS]

  const resp = await apiRequest({
    url: '/screencast/browser/status',
    method: HttpMethods.GET,
    params: {...storeOpts, ...options},
  }, 'object')

  resp?.error
    ? resp?.error?.message &&
        addToast({
          type: 'danger',
          message: resp?.error?.message
        })
    : resp && setBrowserStatus(resp)

  return resp
}