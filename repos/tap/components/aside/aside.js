import React, {useState, useMemo} from 'react'
import { View, Text } from 'SVComponents'
import { noOpObj, isStr, exists } from '@keg-hub/jsutils'
import { useDimensions, useStyle } from '@keg-hub/re-theme'
import { Sidebar, SidebarContent } from 'SVComponents/sidebar'
import { isCssUnits, convertCSSUnits } from 'SVUtils/helpers/styles'

/**
 * Default props for the sidebar component
 * @type {Object}
 * @private
 */
const defProps = {
  to: 0,
  type: 'spring',
  location: 'right',
  sidebarWidth: `33vw`,
}
const defConfig = {
  speed: 20,
  bounciness: 1,
}
const defStyles = {
  container: {
    minHeight: '90vh',
  },
}


const usePositionProps = (props, dims) => {
  const {
    initial,
    to=defProps.to,
    side=defProps.location,
    sidebarWidth=defProps.sidebarWidth,
  } = props

  return useMemo(() => {
    const init = convertCSSUnits(initial || sidebarWidth, dims)
  
    return {
      sidebarWidth,
      location: side,
      to: convertCSSUnits(to, dims),
      initial: (side !== 'right' || (exists(initial) && !initial.startsWith('-')))
        ? init
        : init * -1
    }
  }, [side, initial, sidebarWidth, to, dims])
}

export const Aside = props => {
  const {
    styles,
    type='sprint',
    initialToggle,
    config=defConfig,
  } = props
  
  const dims = useDimensions()
  const asideProps = usePositionProps(props, dims)
  const sidebarStyles = useStyle(defStyles, styles)
  const [toggled, setToggled] = useState(initialToggle || false)

  return (
    <Sidebar
      {...defProps}
      {...asideProps}
      type={type}
      config={config}
      toggled={toggled}
      styles={sidebarStyles}
      onToggled={setToggled}
    >
      <View className='aside-content' style={sidebarStyles.content} >
        {props.children}
      </View>
    </Sidebar>
  )
  
}