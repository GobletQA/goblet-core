import { dispatch, getStore } from 'HKStore'
import { Values, ActionTypes } from 'HKConstants'
import {
  noPropArr,
  noOpObj,
  deepMerge,
  uuid,
  capitalize,
} from '@keg-hub/jsutils'
const { CATEGORIES } = Values

const buildToast = (toast = noOpObj) => {
  const type = toast.type || 'info'

  return deepMerge(
    {
      type,
      id: uuid(),
      icon: type,
      title: capitalize(type),
      timeout: type === 'danger' ? 6000 : 4000,
      message: `This is a ${type} toast component`,
    },
    toast
  )
}

export const addToast = toast => {
  const { items } = getStore().getState()
  const current = items[CATEGORIES.TOASTS] || noPropArr

  // Allow max 4 toasts on the screen at one time
  // In this case log message to the output
  if (current.length >= 3)
    return (
      toast && toast.message && console.log(toast.type || 'info', toast.message)
    )

  const updated = Array.from([...current, buildToast(toast)])

  dispatch({
    type: ActionTypes.SET_ITEMS,
    payload: {
      category: CATEGORIES.TOASTS,
      items: updated,
    },
  })
}
