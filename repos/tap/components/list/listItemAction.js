import React, {useMemo} from 'react'
import { useStyle } from '@keg-hub/re-theme'
import { capitalize, noOpObj, exists } from '@keg-hub/jsutils'
import { Icon, View, Touchable, Text } from '@keg-hub/keg-components'

/**
 * ListItemAction - Default component to render an Action of a ListItem
 * @param {Object} props
 * @param {function} props.onPress - Called when the component is pressed
 * @param {Object} props.parentStyles - Custom styles from the Action parent ListItem
 * @param {Object} props.iconProps - Custom props to pass to the actions Icon component
 * @param {string} props.name - Text name of the action that should be rendered
 * @param {boolean} props.showFeedback - Show feedback when the action is pressed
 * @param {Object} props.styles - Custom styles for the component
 *
 * @returns {Component}
 */
export const ListItemAction = React.memo(props => {
  const {
    onPress,
    parentStyles = noOpObj,
    iconProps = noOpObj,
    name,
    showFeedback,
    styles = noOpObj,
  } = props

  const mergedStyles = useStyle(parentStyles, styles)
  const iconStyles = useStyle(mergedStyles.icon, iconProps.styles)
  const dataSet = useMemo(() => ({ type: name.toLowerCase() }), [name])
  
  return (
    <View className='list-item-action-main' style={mergedStyles.main}>
      <Touchable
        onPress={onPress}
        dataSet={dataSet}
        className={'list-item-action'}
        style={mergedStyles.touchable}
        showFeedback={exists(showFeedback) ? showFeedback : true}
      >
        {iconProps && (
          <Icon
            className='list-item-action-icon'
            {...iconProps}
            styles={iconStyles}
          />
        )}
        {name && (
          <Text className={`list-item-action-name`} style={mergedStyles.name}>
            {capitalize(name)}
          </Text>
        )}
      </Touchable>
    </View>
  )
})
