import { dispatch } from 'HKStore'
import { Values, ActionTypes } from 'HKConstants'

const { CATEGORIES } = Values

export const setTestRun = testRunModel => {
  testRunModel
    ? dispatch({
        type: ActionTypes.SET_ITEM,
        payload: {
          category: CATEGORIES.TEST_RUNS,
          key: testRunModel.file,
          item: testRunModel,
        },
      })
    : console.error(`Can not update test run. A test run model is required!`)
}
