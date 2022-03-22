import { ChevronDown } from 'HKAssets/icons/chevronDown'
import { reStyle } from '@keg-hub/re-theme/reStyle'
import { View, Text } from '@keg-hub/keg-components'

export const ReNodeMain = reStyle(View)(theme => ({
  pL: 8,
  flD: 'row',
  height: 40,
  borderBottomWidth: 1,
  bgC: theme?.colors?.palette?.white01,
  borderBottomColor: theme.tapColors.border,
  ...theme.transition(['borderBottomColor'], 0.5),
}))

export const ReName = reStyle(Text)(theme => ({
  ftSz: 14,
  ftWt: 'bold',
  alS: 'center',
  color: theme.tapColors?.inactive,
}))

export const RePending = reStyle(Text)(theme => ({
  ftSz: 14,
  ftWt: 'bold',
  alS: 'center',
  color: theme.tapColors?.primary,
}))

export const ReEmptyMain = reStyle(View)(theme => ({
  top: 13,
  right: 10,
  position: 'absolute',
}))

export const ReEmptyText = reStyle(Text)(theme => ({
  fontSize: 12,
  color: theme?.colors?.palette?.gray01,
}))

export const ReIcon = reStyle(ChevronDown)(theme => ({
  top: 10,
  right: 10,
  maxWidth: 16,
  maxHeight: 16,
  position: 'absolute',
  fill: theme.tapColors.primaryDark,
}))
