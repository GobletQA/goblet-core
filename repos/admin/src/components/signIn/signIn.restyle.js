import React from 'react'
import { reStyle } from '@keg-hub/re-theme/reStyle'
import { View } from '@keg-hub/keg-components'


export const ReLoading = reStyle(View)(theme => ({
  alI: 'center',
  jtC: 'center',
  display: 'flex',
  mT: theme.margin.size,
  mB: theme.margin.size,
  pB: theme.padding.size,
}))

export const ReHidden = reStyle(View)({
  maxH: 0,
  opacity: 0,
  overflow: 'hidden'
})