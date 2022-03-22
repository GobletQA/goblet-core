import { dispatch } from 'HKStore'
import { Values } from 'HKConstants'
import { ActionTypes } from 'HKConstants'

const { CATEGORIES } = Values
/**
 * updates the current active modal visibility
 */
export const setModalVisibility = visible => {
  dispatch({
    type: ActionTypes.SET_ITEM,
    payload: {
      category: CATEGORIES.MODALS,
      key: 'visible',
      item: visible,
    },
  })
}
