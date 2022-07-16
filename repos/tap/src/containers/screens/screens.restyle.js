import { reStyle } from '@keg-hub/re-theme/reStyle'
import { View } from '@keg-hub/keg-components'

/**
 * Restyle View component that wraps the Main Tabbar
 */
export const ReScreenParent = reStyle(View)(theme => ({
  tp: 0,
  fl: 1,
  zI: -1,
  mW: `100vw`,
  ovf: 'hidden',
  pos: 'relative',
  pH: theme?.padding?.size / 3,
  bgC: theme?.tapColors?.appBackground,
}))

/**
 * Helper component to put the screen content in the correct location
 * Needed due to safari oddness where the top-tabs are not visible 
 */
export const ReHeaderSpacer = reStyle(View)({
  // TODO: should be a better way to set this height: 95
  // The 95 comes from the header height and the top-tabbar height added together
  h: 95,
  w: `100vw`,
  mW: `100vw`,
  ovf: 'hidden',
})

export const ReEditorMain = reStyle(View)(theme => ({
  // fl: 1,
  flD: 'row',
}))

export const RsScreenMain = reStyle(View)(theme => ({
  fl: 1,
  w: `100%`,
  flD: 'column',
}))
