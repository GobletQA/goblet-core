import { getStore } from 'HKStore'
import { Values } from 'HKConstants'
import { get, exists } from '@keg-hub/jsutils'

/**
  * Accepts a path to a key on the world object and returns the value
  * Uses dot notation for navigating multiple levels
  * @param {String|Array} location - Path to the key on the world object
  * @param {String|Array} fallback - Alternate world location to use if first does not exist
  * @param {*} valueFallback - Value to use if location and fallback are not found
  *
  * @returns {*} - Found value at location or fallback
 */
export const getWorldVal = (location, fallback, valueFallback, repo) => {
  repo = repo || getStore()?.getState()?.items?.[Values.STORAGE.REPO]
  const locationVal = get(repo?.world, location)

  const found = exists(locationVal)
    ? locationVal
    : fallback && get(repo?.world, fallback)

  return exists(found) ? found : valueFallback
}