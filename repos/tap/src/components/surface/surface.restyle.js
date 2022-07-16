import { View } from '@keg-hub/keg-components'
import { reStyle } from '@keg-hub/re-theme/reStyle'

export const SurfaceMain = reStyle(View)(theme => ({
  p: 0,
  m: 0,
  bW: 0,
  bRad: 3,
  shR: 10,
  shO: 0.05,
  bS: 'solid',
  bgC: theme.tapColors.white,
  shOff: { width: 0, height: 0 },
  bC: theme.colors.palette.gray01,
  shC: theme.tapColors.shadowColor,
  bTLR: theme.tapColors.borderRadius,
  bTRR: theme.tapColors.borderRadius,
  bxS: `1px 1px 5px ${theme.colors.opacity._5}`,
}))


export const SurfaceActionSpacer = reStyle(View)(theme => ({
  w: theme.margin.size || 15,
  h: theme.margin.size || 15,
}))