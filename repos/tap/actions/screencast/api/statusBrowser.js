import { getStore } from 'HKStore'
import { Values } from 'HKConstants'
import { noOpObj } from '@keg-hub/jsutils'
import { addToast } from 'HKActions/toasts'
import { apiRequest } from 'HKUtils/api/apiRequest'
import { setBrowserStatus } from '../local/setBrowserStatus'
import { getActiveScreen } from 'HKUtils/helpers/getActiveScreen'

const { HttpMethods, CATEGORIES, SCREENS } = Values

/**
 * Calls the backend API to get the browser status
 * Then calls setBrowser status with the response
 * @param {Object} options - Custom options to pass to the backend API
 *
 * @return {Object} - Backend API response
 */
export const statusBrowser = async (options = noOpObj) => {
  const { items } = getStore()?.getState()
  if (!items) return console.warn(`No items set in the store`)

  // Ensure we are on the Screencast screen
  // If we are not, we don't care about browser status
  const activeScreen = getActiveScreen(items)
  if (activeScreen.id !== SCREENS.SCREENCAST) return noOpObj

  const storeOpts = items[CATEGORIES.BROWSER_OPTS]

  const {
    data,
    error,
    success
  } = await apiRequest({
    url: '/screencast/browser/status',
    method: HttpMethods.GET,
    params: { ...storeOpts, ...options },
  })

  !success || error
    ? addToast({
        type: 'error',
        message: error || `Failed to get the browser status, please try again later`
      })
    : data && setBrowserStatus(data)

  return data
}
