import { Values, ActionTypes } from 'HKConstants'
import { dispatch } from 'HKStore'
const { CATEGORIES } = Values

export const upsertSteps = steps => {
  steps &&
    dispatch({
      type: ActionTypes.UPSERT_ITEMS,
      payload: {
        category: CATEGORIES.STEPS,
        items: steps,
      },
    })
}
