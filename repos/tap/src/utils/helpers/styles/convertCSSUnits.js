import { isStr } from '@keg-hub/jsutils'

/**
 * Converts the passed in ccs unit value it to the value as px
 * Allows using css units with the Animate API
 *
 * @param {string} item - Value to be converted to px
 * @param {Object} dims - Current window dimensions
 *
 * @returns {number} - item param converted to a number in px
 */
export const convertCSSUnits = (item, dims) => {
  if (!isStr(item)) return item

  const asInt = parseInt(item, 10)

  return item.includes('px')
    ? asInt
    : item.includes('rem') || item.includes('em')
    ? asInt * 16
    : item.includes('vh')
    ? dims.height && dims.height * (asInt / 100)
    : item.includes('vw')
    ? dims.width && dims.width * (asInt / 100)
    : asInt
}
