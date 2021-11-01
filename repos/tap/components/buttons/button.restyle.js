import React from 'react'
import { reStyle } from '@keg-hub/re-theme/reStyle'
import { useIconProps } from 'SVHooks/useIconProps'
import { View, Button, Text } from '@keg-hub/keg-components'

export const HerkinButton = reStyle(props => {
  const { children, Icon, text, styles, classes, ...btnProps } = props
  const iconProps = useIconProps(props, styles?.icon)

  return (
    <View
      style={styles?.main}
      className={classes?.main || `herkin-button.main`}
    >
      <Button
        {...btnProps}
        className={classes?.button || `herkin-button`}
        styles={styles.button}
      >
        {Icon && (
          <Icon
            className={classes?.icon || `herkin-button-icon`}
            {...iconProps}
          />
        )}
        {(children || text) && (
          <Text
            style={styles?.text}
            className={classes?.text || `herkin-button-text`}
          >
            {children || text}
          </Text>
        )}
      </Button>
    </View>
  )

}, 'styles')((theme) => ({
  main: {},
  button: {
    default: {
      main: {
        flD: 'row',
        alI: 'center',
        jtC: 'center',
        pH: theme.padding.size,
        pV: (theme.padding.size / 3) * 2,
      }
    }
  },
  icon: {
    mR: 10,
    fontSize: 20,
    color: theme.colors.palette.white01,
  },
  text: {
    fontSize: 14,
    color: theme.colors.palette.white01,
  },
}))