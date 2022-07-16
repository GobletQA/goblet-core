import { Surface } from 'HKComponents/surface'
import { reStyle } from '@keg-hub/re-theme/reStyle'
import { Grid, Row, View, Text } from '@keg-hub/keg-components'

export const ReCmdSurface = reStyle(
  Surface,
  'styles'
)(theme => ({
  main: {
    mB: theme.margin.size * 2,
  },
}))

export const ReCmdMain = reStyle(Grid)(theme => ({
  p: theme.padding.size,
  flex: 'unset',
  display: 'unset',
}))

export const ReCmdRow = reStyle(Row)(theme => ({
  bW: 2,
  h: 450,
  maxH: 450,
  overflowY: 'auto',
  borderRightWidth: 0,
  p: theme.padding.size,
  bgC: theme.tapColors.defaultDark60,
  bC: theme.tapColors.borderColor,
  bRad: theme.tapColors.borderRadius,
}))

export const ReOutputMain = reStyle(View)(theme => ({
  w: '100%',
}))

export const ReMessage = reStyle(View)(theme => ({
  mB: 5,
}))

export const ReMessageText = reStyle(Text)(theme => ({
  c: theme.colors.palette.white01,
}))

/**
 export const ReMessageSuccess = reStyle(Text)(theme => ({
   c: theme.tapColors.success,
 }))
 
 export const ReMessageError = reStyle(Text)(theme => ({
   c: theme.tapColors.error,
 }))
 
 export const ReMessageDefault = reStyle(Text)(theme => ({
   c: theme.tapColors.white,
 }))
 */
