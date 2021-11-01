
import React, { useCallback, useEffect, useMemo } from 'react'
import { Text, View } from 'SVComponents'
import { reStyle } from '@keg-hub/re-theme/reStyle'
import { useToggledStyles } from 'SVHooks/styles/useToggledStyles'
import { useStyle, useTheme } from '@keg-hub/re-theme'
import { ToggleMain, ToggleAction, ToggleContent, ToggleIcon } from './sidebar.restyle'

/**
 * Helper to listen for click events
 * @function
 * @private
 * <br/>Checks if the sidebar should be closed based on click location
 * @param {boolean} toggled - Is the sidebar toggled open
 * @param {function} setIsToggled - Toggle the state of the sidebar open or closed
 * @param {Object} event - Native dom event
 *
 * @returns {void}
 */
const useWindowClick = (cb, ...args) => {
  const onWindowClick = useCallback(cb.bind(window, ...args), [cb, ...args])

  useEffect(() => {
    window.addEventListener('click', onWindowClick)
    return () => window.removeEventListener('click', onWindowClick)
  }, [onWindowClick])
  
}


/**
 * Helper to listen for click events
 * @function
 * @private
 * <br/>Checks if the sidebar should be closed based on click location
 * @param {boolean} toggled - Is the sidebar toggled open
 * @param {function} setIsToggled - Toggle the state of the sidebar open or closed
 * @param {Object} event - Native dom event
 *
 * @returns {void}
 */
const onWindowClick = (toggled, setIsToggled, event) => {
  if(!toggled) return

  const sideBarEl = event && event.target.closest('.sidebar-main')
  !sideBarEl && setIsToggled(false)
}

/**
 * Styles to rotate the Icon. Defined outside the component to keep reference identity
 * @type {Object}
 */
const iconRotateOptions = {
  left: {
    on: { transform: 'rotate(90deg)' },
    off: { transform: 'rotate(270deg)' },
  },
  right: {
    on: { transform: 'rotate(270deg)' },
    off: { transform: 'rotate(90deg)' }
  }
}

/**
 * Helper hook to memoize the props for the Icon
 * @function
 * @private
 * @param {boolean} toggled - Is the sidebar toggled open
 * @param {Object} themeStyles - Styles built from the theme and passed in style object
 *
 * @returns {Object} - Memoized Icon props
 */
const useIconProps = (toggled, themeStyles, location='left') => {
  const theme = useTheme()
  const iconRotate = iconRotateOptions[location]
  const iconStyle = useStyle(themeStyles.icon, toggled ? iconRotate.on : iconRotate.off)

  return useMemo(() => {
    return {
      styles: {main: iconStyle},
      size: themeStyles?.icon?.fontSize || theme?.typography?.default?.fontSize,
      stroke: themeStyles?.icon?.c || themeStyles?.icon?.color || theme.colors.palette.white01
    }
  }, [theme, themeStyles, iconStyle])
}

/**
 * ToggleContainer
 * @type {React.Component}
 * @param {Object} props
 * @param {string} props.text - Text to display when no icon is shown
 * @param {Object} props.styles - Defines how the component should look
 * @param {boolean} props.toggled - State of the sidebar, true if sidebar is open
 * @param {function} props.onPress - Method called when the component is pressed
 * @param {function} props.setIsToggled - Method to switch the toggled state when called
 * @param {number} props.sidebarWidth - Width of the sideBar component
 * @param {React.Component} props.Icon - Overrides the default Icon Component
 *
 */
const ToggleContainer = props => {
  const {
    to,
    text,
    styles,
    initial,
    toggled,
    onPress,
    location,
    setIsToggled,
    sidebarWidth,
    Icon=ToggleIcon,
    onOffClick=onWindowClick
  } = props

  const iconProps = useIconProps(toggled, styles, location)
  useWindowClick(onOffClick, toggled, setIsToggled)

  return (
    <ToggleAction
      to={to}
      initial={initial}
      onPress={onPress}
      location={location}
      styles={styles?.action}
      sidebarWidth={sidebarWidth}
      className={`sidebar-toggle-action`}
    >
      {({ hovered }) => (
        <View
          className={`sidebar-toggle-content`}
          style={styles?.content}
        >
          { !text
            ? (<Icon {...iconProps} hovered={hovered} />)
            : (
                <Text
                  className={`sidebar-toggle-text`}
                  style={styles?.text}
                >
                  { text }
                </Text>
              )
          }
        </View>
      )}
    </ToggleAction>
  )
}

/**
 * SidebarToggle
 * @type {React.Component}
 * @param {Object} props - see Sidebar PropTypes below
 * @param {function} props.onPress - Method called when the component is pressed
 * @param {boolean} props.toggled - State of the sidebar, true if sidebar is open
 * @param {Object} props.styles - Defines how the component should look
 * @param {string} props.text - Text to display when no icon is shown
 * @param {React.Component} props.children - Components to be render as Children of this component
 * @param {function} props.setIsToggled - Method to switch the toggled state when called
 * @param {number} props.sidebarWidth - Width of the sideBar component
 *
 */
export const SidebarToggle = props => {
  const {
    to,
    text,
    styles,
    initial,
    onPress,
    toggled,
    location,
    children,
    setIsToggled,
    sidebarWidth,
  } = props

  const joinedStyles = useStyle('sidebar.toggle', styles)
  const toggleStyles = useToggledStyles(toggled, joinedStyles)

  return (
    <ToggleMain
      className={`sidebar-toggle-main`}
      style={toggleStyles?.main}
    >
    {children || (
        <ToggleContainer
          to={to}
          text={text}
          onPress={onPress}
          initial={initial}
          toggled={toggled}
          location={location}
          styles={toggleStyles}
          sidebarWidth={sidebarWidth}
          setIsToggled={setIsToggled}
        />
      )}
    </ToggleMain>
  )
}
