import { dispatch, getStore } from 'SVStore'
import { devLog } from 'SVUtils'
import { Values } from 'SVConstants'
import { addToast } from 'SVActions/toasts'
import { noOpObj, get } from '@keg-hub/jsutils'
import { apiRequest } from 'SVUtils/api/apiRequest'

const { HttpMethods, CATEGORIES } = Values

export const startBrowser = async (options=noOpObj) => {

  const { items } = getStore()?.getState()
  if(!items)
    return console.warn(`No items set in the store`)
  
  const storeOpts = items[CATEGORIES.BROWSER_OPTS]

  addToast({
    type: 'info',
    message: `Starting Browser...`
  })

  const resp = await apiRequest({
    url: '/screencast/browser/start',
    method: HttpMethods.GET,
    params: {...storeOpts, ...options },
  }, 'object')
  
  // TODO: store browser running status in redux
  // Then use that to tell update the canvas to reload as needed
  console.log(`---------- resp ----------`)
  console.log(resp)

  return resp
  
  // error &&
  //   error.message &&
  //   addToast({
  //     type: 'danger',
  //     message: error.message
  //   })

}