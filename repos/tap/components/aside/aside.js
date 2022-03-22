import React, { useState, useMemo, useRef } from 'react'
import { exists } from '@keg-hub/jsutils'
import { View, Sidebar } from '@keg-hub/keg-components'
import { convertCSSUnits } from 'HKUtils/helpers/styles'
import { useDimensions, useStyle } from '@keg-hub/re-theme'

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
    minHeight: '100vh',
    marginTop: 90,
  },
}

const usePositionProps = (props, dims) => {
  const {
    initial,
    side = defProps.location,
    sidebarWidth = defProps.sidebarWidth,
  } = props

  return useMemo(() => {
    const sidebarW = convertCSSUnits(sidebarWidth, dims)
    const init = initial ? convertCSSUnits(initial, dims) : sidebarW
    return {
      sidebarWidth: sidebarW,
      initial:
        side !== 'right' || (exists(initial) && !initial.startsWith('-'))
          ? init
          : init * -1,
    }
  }, [sidebarWidth, side, initial, dims.width])
}

export const Aside = props => {
  const {
    styles,
    type = 'sprint',
    initialToggle,
    config = defConfig,
    to = defProps.to,
    side = defProps.location,
} = props

  const dims = useDimensions()
  const asideProps = usePositionProps(props, dims)
  const sidebarStyles = useStyle(defStyles, styles)
  const [toggled, setToggled] = useState(initialToggle || false)

  // Hack to get the right-sidebar to stay in place
  const asideRefProps = useRef(asideProps)
  
  return (
    <Sidebar
      {...defProps}
      {...asideRefProps.current}
      type={type}
      to={to}
      side={side}
      config={config}
      toggled={toggled}
      styles={sidebarStyles}
      onToggled={setToggled}
    >
      <View className='aside-content' style={sidebarStyles.content}>
        {props.children}
      </View>
    </Sidebar>
  )
}
