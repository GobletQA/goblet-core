import { screenModel } from 'SVModels'
import { Values } from 'SVConstants'
const { CATEGORIES, SCREENCAST_DEFAULTS, BROWSER_DEFAULTS } = Values

/**
 * Sets screencast store defaults from constants
 * @type Object
 *
 * @returns {void}
 */
export const screencast = {
  [CATEGORIES.SCREENCAST_STATUS]: {
    ...SCREENCAST_DEFAULTS,
  },
  [CATEGORIES.BROWSER_OPTS]: {
    ...BROWSER_DEFAULTS,
  },
}
