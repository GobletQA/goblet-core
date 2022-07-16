import { Values } from 'HKConstants'
import { addToast } from 'HKActions/toasts'
import { apiRequest } from 'HKUtils/api/apiRequest'
const { HttpMethods } = Values

export const actionBrowser = async (props, log=true) => {
  const {
    data,
    error,
    success
  } = await apiRequest({
    url: '/screencast/browser/action',
    method: HttpMethods.POST,
    params: props,
  })

  if(!success || error)
    return addToast({
      type: 'error',
      message: error || `Browser action failed to run`
    })
  
  log && addToast({
    type: 'success',
    message: `Browser action ran successfully`
  })

}
