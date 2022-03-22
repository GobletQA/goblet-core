import React from 'react'
import { noOpObj } from '@keg-hub/jsutils'
import { View, Text } from '@keg-hub/keg-components'
import { reStyle } from '@keg-hub/re-theme/reStyle'

const ReMain = reStyle(View)(theme => ({
  flD: 'column',
  alI: 'center',
  jtC: 'center',
  mT: theme.margin.size,
  mB: theme.margin.size,
}))

const ReText = reStyle(Text)(theme => ({
  ftSz: 14,
  c: theme.tapColors.defaultLight,
}))

export const OtherProviders = props => {
  const { styles = noOpObj } = props

  return (
    <ReMain style={styles.main}>
      <ReText style={styles.text}>More coming soon</ReText>
    </ReMain>
  )
}
