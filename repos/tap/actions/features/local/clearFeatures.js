import { setItems } from 'HKActions'
import { Values } from 'HKConstants'
import { noOpObj } from '@keg-hub/jsutils'

const { CATEGORIES } = Values

/**
 * Dispatches an update to clear out all features by resetting the state to an empty object
 * @type {function}
 *
 * @returns {void}
 */
export const clearFeatures = () => {
  setItems(CATEGORIES.FEATURES, noOpObj)
}
