import { View, H5 } from '@keg-hub/keg-components'
import { reStyle } from '@keg-hub/re-theme/reStyle'

export const NoActiveMain = reStyle(View)(theme => ({
  width: '100%',
  jC: 'center',
  alI: 'center',
  mT: theme.margin.size,
  pH: theme.padding.size,
}))

export const NoActiveText = reStyle(H5)(theme => ({
  width: '100%',
  textAlign: 'center',
  pH: theme.padding.size,
  pV: theme.padding.size * 2,
  bgC: theme.tapColors.backGround,
  color: theme.tapColors.defaultLight,
}))