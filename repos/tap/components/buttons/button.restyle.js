import React from 'react'
import { useIconProps } from 'HKHooks/useIconProps'
import { reStyle } from '@keg-hub/re-theme/reStyle'
import { useClassNames } from 'HKHooks/useClassNames'
import { View, Button, Text } from '@keg-hub/keg-components'

const defClasses = {
  main: 'button-main',
  button: 'button',
  icon: 'button-icon',
  text: 'button-text',
}

export const GobletButton = reStyle(props => {
  const {
    children,
    Icon,
    text,
    styles,
    classPrefix = 'goblet',
    classNames = defClasses,
    ...btnProps
  } = props

  const classes = useClassNames(classNames, classPrefix)
  const iconProps = useIconProps(props, styles?.icon)

  return (
    <View style={styles?.main} className={classes?.main}>
      <Button {...btnProps} className={classes?.button} styles={styles.button}>
        {Icon && (
          <Icon
            className={classes?.buttonIcon || classes?.icon}
            {...iconProps}
          />
        )}
        {(children || text) && (
          <Text
            style={styles?.buttonText || styles?.text}
            className={classes?.buttonText || classes?.text}
          >
            {children || text}
          </Text>
        )}
      </Button>
    </View>
  )
}, 'styles')(theme => ({
  main: {},
  button: {
    default: {
      main: {
        $all: {
          flD: 'row',
          alI: 'center',
          jtC: 'center',
          pH: theme.padding.size,
          pV: theme.padding.size / 2,
          borderRadius: theme.tapColors.borderRadius,
        },
      },
    },
  },
  icon: {
    mR: theme.margin.size / 3,
    fontSize: 20,
    color: theme.colors.palette.white01,
  },
  text: {
    fontSize: 14,
    fontWeight: 'bold',
    color: theme.colors.palette.white01,
  },
}))
