import { getStore } from 'HKStore'
import { Values } from 'HKConstants'
import { addToast } from 'HKActions/toasts'
import { noOpObj, get } from '@keg-hub/jsutils'
import { apiRequest } from 'HKUtils/api/apiRequest'
import { getActiveScreen } from 'HKUtils/helpers/getActiveScreen'

const { HttpMethods, CATEGORIES, SCREENS } = Values

/**
 * Makes API call to restart the Playwright browser for VNC playback
 * If screen is not screencast, then the browser restart is skipped
 *
 */
export const restartBrowser = async (options = noOpObj) => {
  const { items } = getStore()?.getState()
  if (!items) return console.warn(`No items set in the store`)

  // We don't want to restart the browser
  // ff we're not on the screencast page
  // Check the current screen is screencast
  // If it's not then don't restart the browser
  const activeScreen = getActiveScreen(items)
  if (activeScreen.id !== SCREENS.SCREENCAST) return noOpObj

  addToast({
    type: 'info',
    message: `Restarting Browser...`,
  })

  const {
    data,
    error,
    success
  } = await apiRequest({
    url: '/screencast/browser/restart',
    method: HttpMethods.POST,
    params: {
      ...options,
      ...items[CATEGORIES.BROWSER_OPTS],
    },
  })

  if(!success || error)
    addToast({
      type: 'error',
      message: error || `Failed to restart the browser, please try again later.`,
    })

  // TODO: store browser running status in redux
  // Then use that to tell update the canvas to reload as needed
  return data
}
