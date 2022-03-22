import { reStyle } from '@keg-hub/re-theme/reStyle'
import { View } from '@keg-hub/keg-components'

export const TabbarMain = reStyle(View)({
  fl: 1,
})

export const TabbarContainer = reStyle(View)(theme => ({
  zIndex: 6,
  minHeight: 40,
  cursor: 'pointer',
  flexDirection: 'row',
  width: `calc( 100% + ${theme.padding.size * 2}px)`,
}))

export const TabViewMain = reStyle(View)({
  fl: 1,
  ovfX: 'hidden',
})
