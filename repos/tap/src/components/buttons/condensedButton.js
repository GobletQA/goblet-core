import React, { useCallback, useMemo } from 'react'
import { noOpObj, checkCall } from '@keg-hub/jsutils'
import { useThemeHover } from '@keg-hub/re-theme'
import { useClassNames } from 'HKHooks/useClassNames'
import {
  View,
  Text,
  TouchableIcon,
  isValidComponent,
} from '@keg-hub/keg-components'

const defClasses = {
  main: 'main',
  container: 'container',
  content: 'content',
  text: 'text',
  icon: 'icon',
}

const IconComponent = props => {
  const {
    Icon,
    Component = Icon,
    children,
    classNames = noOpObj,
    styles = noOpObj,
    size,
    stroke,
    fill,
    text,
  } = props

  return (
    <View style={styles.container} className={classNames.content}>
      {isValidComponent(Component) && (
        <Component
          className={classNames?.icon}
          size={size}
          stroke={stroke}
          fill={fill}
          style={styles?.icon}
        />
      )}
      <Text style={styles.text} className={classNames.text}>
        {children || text}
      </Text>
    </View>
  )
}

export const CondensedButton = props => {
  const {
    styles,
    onPress,
    onClick = onPress,
    classNames = defClasses,
    classPrefix = 'condensed',
  } = props

  const classes = useClassNames(classNames, classPrefix)

  const [ref, toggleStyles=noOpObj] = useThemeHover(styles?.default, styles?.hover)
  const iconSize = toggleStyles?.icon?.ftSz || toggleStyles?.icon?.fontSize || 20
  const iconStroke = toggleStyles?.icon?.c || toggleStyles?.icon?.color

  const onPressCb = useCallback(evt => checkCall(onClick, evt), [onClick])

  return (
    <View className={classes?.main} ref={ref} style={toggleStyles?.main}>
      <TouchableIcon
        className={classes.container}
        Component={
          <IconComponent
            {...props}
            classNames={classes}
            size={iconSize}
            stroke={iconStroke}
            fill={iconStroke}
            styles={toggleStyles}
          />
        }
        onPress={onPressCb}
        touchStyle={toggleStyles?.touch}
      />
    </View>
  )
}
