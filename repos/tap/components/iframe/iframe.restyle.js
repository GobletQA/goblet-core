import React from 'react'
import { reStyle } from '@keg-hub/re-theme/reStyle'
import { View, Icon, Touchable } from '@keg-hub/keg-components'

export const ReIframe = reStyle('iframe')(theme => ({
  fl: 1,
  minH: 200,
  border: 'none',
  bgC: theme.colors.palette.white01,
}))

export const ReIframeHeaderMain = reStyle(Touchable)(theme => ({
  flD: 'row',
  alI: 'center',
}))

export const ReIframeHeaderIcon = reStyle(props => {
  const { styles, className, Icon: Element } = props
  return (
    <View style={styles.main}>
      <Icon
        size={styles?.icon?.size}
        color={styles?.icon?.color}
        className={className}
        Component={Element}
      />
    </View>
  )
}, 'styles')(theme => ({
  main: {
    mL: theme.margin.size / 2,
  },
  icon: {
    size: 18,
    color: theme.tapColors.primary,
  },
}))
