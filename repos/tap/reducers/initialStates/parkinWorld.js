import { Values } from 'SVConstants'
import { getParkinWorld } from 'SVUtils/helpers/getParkinWorld'

const { CATEGORIES } = Values

/**
 * Sets parkin world to the store
 * @type Object
 *
 * @returns {void}
 */
export const parkinWorld = {
  [CATEGORIES.PARKIN_WORLD]: getParkinWorld(),
}