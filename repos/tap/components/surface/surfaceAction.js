import React from 'react'
import { useThemeHover } from '@keg-hub/re-theme'
import { reStyle } from '@keg-hub/re-theme/reStyle'
import { Text } from '@keg-hub/keg-components/text'
import { useIconProps } from 'HKHooks/useIconProps'
import { Touchable } from '@keg-hub/keg-components/touchable'

export const SurfaceAction = reStyle(props => {
  const {
    Icon,
    text,
    styles,
    onPress,
  } = props

  const [touchRef, actionStyles] = useThemeHover(
    styles?.default,
    styles?.hover
  )
  const iconProps = useIconProps(props, actionStyles?.icon)
  
  return (
    <Touchable
      ref={touchRef}
      onPress={onPress}
      style={actionStyles?.main}
    >
      {Icon && (<Icon {...iconProps} />)}
      {text && (
        <Text style={actionStyles?.text}>
          {text}
        </Text>
      )}
    </Touchable>
  )
}, 'styles')((theme, { type=`success` }) => {
  
  const color = theme.tapColors[`${type}Light`] || theme.tapColors.successLight

  return {
    default: {
      main: {
        opacity: 0.5,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        ...theme.transition(['opacity'], 0.8),
      },
      icon: {
        color,
        fontSize: 12,
        marginRight: 5,
      },
      text: {
        color,
        ftWt: 'bold',
        fontSize: 10,
      },
    },
    hover: {
      main: {
        opacity: 1,
      },
    },
  }
})