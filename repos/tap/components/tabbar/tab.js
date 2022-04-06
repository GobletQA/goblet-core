import React, {useCallback} from 'react'
import { useIconProps } from 'HKHooks/useIconProps'
import { useThemeHover, useStyle } from '@keg-hub/re-theme'
import { get, isStr, isArr, noOpObj } from '@keg-hub/jsutils'
import {
  Label,
  Icon,
  Touchable,
  View,
  isValidComponent,
} from '@keg-hub/keg-components'

const renderByType = (Element, props) => {
  return isValidComponent(Element) ? (
    React.cloneElement(Element, props, Element.children)
  ) : isArr(Element) ? (
    Element
  ) : Wrapper ? (
    <Wrapper {...props}>{Element}</Wrapper>
  ) : (
    Element
  )
}

const BuildChildren = React.memo(props => {
  // If there are custom children, just return
  if (props.children) return renderByType(props.children, props)

  const {
    icon,
    Title,
    styles,
    title='',
    Icon:IconComp,
  } = props

  const TitleComp = Title || title
  const Components = []

  // If there's a title component || title string add it to the components array
  TitleComp &&
    Components.push(
      // Check if it's a react component
      isValidComponent(TitleComp) ? (
        <TitleComp
          key='tabbar-title-component'
          className='tabbar-tab-title'
          {...props}
        />
      ) : (
        <Label
          key={'tabbar-title-label'}
          className='tabbar-tab-title'
          style={styles.title || styles.text}
        >
          {TitleComp}
        </Label>
      )
    )

  // If not Icon component, just return
  if (!IconComp && !icon) return Components

  const iconData = isStr(icon) ? { name: icon } : icon || noOpObj
  // Get the location of the icon
  const location = get(icon, 'location', 'before')
  const iconProps = useIconProps(iconData, styles.icon[location])

  // Get the array add method based on the location
  const method = location === 'before' ? 'unshift' : 'push'
  // Use the method to add the icon component to the Components array
  Components[method](
    isValidComponent(IconComp) ? (
      // If icon is a component, then call it and return
      <IconComp
        key={'tabbar-icon-component'}
        className='tabbar-tab-icon'
        {...iconProps}
      />
    ) : (
      // Otherwise use the KegComponents Icon
      <Icon
        key={'icon'}
        className='tabbar-tab-icon'
        {...iconProps}
        {...iconData}
      />
    )
  )

  return Components
})

/**
 *
 * @param {Object} props
 * @param {Boolean} props.active
 * @param {string} props.id
 * @param {Function} props.onTabSelect
 * @param {Object} props.styles
 * @param {Boolean=} props.disabled
 */
export const Tab = React.memo(props => {
  const {
    id,
    active,
    styles,
    tabStyle,
    onTabSelect,
    disabled=false,
    clickable=true,
  } = props

  const [styleRef, themeStyles] = useThemeHover(styles?.default, styles?.hover)
  const mergedStyles = useStyle(themeStyles, active && styles?.active, tabStyle)
  const onPress = useCallback(() => onTabSelect(id), [id, onTabSelect])

  const ParentComponent = clickable ? Touchable : View

  return (
    <ParentComponent
      onPress={onPress}
      disabled={disabled}
      className='tabbar-tab'
      style={mergedStyles.main}
      touchRef={!disabled && styleRef}
    >
      <View
        className='tabbar-tap-icon-container'
        style={mergedStyles.container}
      >
        <BuildChildren
          {...props}
          styles={mergedStyles}
        />
      </View>
    </ParentComponent>
  )
})
