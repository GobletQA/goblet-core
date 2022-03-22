import { pickKeys } from '@keg-hub/jsutils'
import { useSelector as useSelectorRedux, shallowEqual } from 'react-redux'

/**
 * Pulls items from the store based on their category name
 * Allows passing multiple categories
 * @param {string} category - Category name of the item to pull from the store
 * 
 * @returns {Object} - Containing the category data keyed by category name
 */
export const useSelector = (...categories) => {
  return useSelectorRedux(
    ({ items }) => pickKeys(items, categories),
    shallowEqual
  )
}
