import { dispatch, getStore } from 'SVStore'
import { devLog } from 'SVUtils'
import { Values } from 'SVConstants'
import { addToast } from 'SVActions/toasts'
import { noOpObj, get } from '@keg-hub/jsutils'
import { apiRequest } from 'SVUtils/api/apiRequest'

const { HttpMethods, CATEGORIES } = Values

export const stopBrowser = async (options=noOpObj) => {

  const { items } = getStore()?.getState()
  if(!items)
    return console.warn(`No items set in the store`)
  
  const storeOpts = items[CATEGORIES.BROWSER_OPTS]

  addToast({
    type: 'info',
    message: `Stopping Browser...`
  })

  const resp = await apiRequest({
    url: '/screencast/browser/stop',
    method: HttpMethods.POST,
    params: {...storeOpts, ...options},
  }, 'object')
  
  console.log(`---------- resp ----------`)
  console.log(resp)
  
  // error &&
  //   error.message &&
  //   addToast({
  //     type: 'danger',
  //     message: error.message
  //   })

}