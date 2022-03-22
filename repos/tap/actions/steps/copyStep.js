import { dispatch } from 'HKStore'
import { Values, ActionTypes } from 'HKConstants'
const { CATEGORIES } = Values

export const copyStep = step => {
  step
    ? dispatch({
        type: ActionTypes.SET_ITEM,
        payload: {
          key: 0,
          category: CATEGORIES.COPY_STEP,
          item: { ...step },
        },
      })
    : console.warn(`Can not copy empty step!`)
}
