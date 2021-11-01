import React from 'react'
import { View } from '@keg-hub/keg-components'
import { reStyle } from '@keg-hub/re-theme/reStyle'

export const SurfaceMain = reStyle(View)(theme => ({
  p: 0,
  m: 0,
  fl: 1,
  bW: 0,
  bRad: 3,
  bS: 'solid',
  shadowRadius: 10,
  shadowOpacity: 0.05,
  bgC: theme.tapColors.white,
  bC: theme.colors.palette.gray01,
  shadowOffset: { width: 0, height: 0 },
  shadowColor: theme.tapColors.shadowColor,
  bxS: `1px 1px 5px ${theme.colors.opacity._05}`,
  borderTopLeftRadius: theme.tapColors.borderRadius,
  borderTopRightRadius: theme.tapColors.borderRadius,
}))


