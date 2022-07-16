import { getStore } from 'HKStore'
import { Values } from 'HKConstants'
import { noOpObj } from '@keg-hub/jsutils'
import { addToast } from 'HKActions/toasts'
import { apiRequest } from 'HKUtils/api/apiRequest'

const { HttpMethods, CATEGORIES } = Values

export const stopBrowser = async (options = noOpObj) => {
  const { items } = getStore()?.getState()
  if (!items) return console.warn(`No items set in the store`)

  const storeOpts = items[CATEGORIES.BROWSER_OPTS]

  addToast({
    type: 'info',
    message: `Stopping Browser...`,
  })

  const {
    data,
    error,
    success
  } = await apiRequest({
    url: '/screencast/browser/stop',
    method: HttpMethods.POST,
    params: { ...storeOpts, ...options },
  })

  if(!success || error)
    addToast({
      type: 'error',
      message: error || `Failed to stop the browser, please try again later`
    })

  // TODO: Update setBrowserStatus to handle browser status of stopped
  // data && setBrowserStatus(data)
  
  console.log(`---------- data ----------`)
  console.log(data)

  return data
}
