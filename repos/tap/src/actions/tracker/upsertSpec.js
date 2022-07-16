import { getStore } from 'HKStore'
import { setItem } from 'HKActions'
import { Values } from 'HKConstants'
import { get, noOpObj } from '@keg-hub/jsutils'
import { addToast } from '../toasts/addToast'
const { CATEGORIES } = Values


const formatKey = () => {
  
}

/**
 * Add to the store, so that that tracker component can pull in the specs as they happen
 * Match the spec to a step in a the active feature file
 * This will allow updating the UI with the status of the spec
 */
export const upsertSpec = (specResult, idx) => {
  if(!specResult)
    return addToast({
      type: `error`,
      timeout: 6000,
      message: `Can not add spec result that is undefined`,
    })

  const { items } = getStore().getState()
  const result = get(items, [CATEGORIES.SPEC_RESULTS, specResult.description], noOpObj)

  specResult && setItem(CATEGORIES.SPEC_RESULTS, specResult.description, {
    ...result,
    [specResult.action]: specResult
  })
}