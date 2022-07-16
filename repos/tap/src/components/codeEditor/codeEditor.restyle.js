import { View } from '@keg-hub/keg-components'
import { reStyle } from '@keg-hub/re-theme/reStyle'

export const ReResizeContainer = reStyle(View)((theme, { width }) => {
  return {
    fl: width ? 2 : 1,
    d:'flex',
    ovf: 'hidden',
    h: 'fit-content',
    maxW: width
  }
})
