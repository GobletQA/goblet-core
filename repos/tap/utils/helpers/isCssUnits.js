import { isStr } from '@keg-hub/jsutils'

// TODO: move this into a more general helper
// Probably best in re-theme
// Also add jsDocs
const cssUnits = ['px', 'vh', 'vw', 'rem', 'em', 'pic']
export const isCssUnits = item => {
  return isStr(item) && cssUnits.find(unit => item.includes(unit))
}
