import { isStr } from '@keg-hub/jsutils'

/**
 * CSS unit types
 * @type {Array}
 */
const cssUnits = ['px', 'vh', 'vw', 'rem', 'em', 'pic']

/**
 * Checks if the passed in item is a string of css units
 *
 * @param {string} item - Value to check for css units
 *
 * @returns {boolean} - True if the item param is a string of css units
 */
export const isCssUnits = item => {
  return isStr(item) && cssUnits.find(unit => item.includes(unit))
}
