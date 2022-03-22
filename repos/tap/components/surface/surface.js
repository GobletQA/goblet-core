import React, { useCallback, useState, useEffect } from 'react'
import { useStyle } from '@keg-hub/re-theme'
import { SurfaceHeader } from './surfaceHeader'
import { SurfaceMain } from './surface.restyle'
import { checkCall, exists } from '@keg-hub/jsutils'
import { Drawer, Row } from '@keg-hub/keg-components'

const SCContent = React.memo(props => {
  return (
    <Row
      style={props.style}
      className={`surface-row ${props.className || ''}`.trim()}
      children={props.children} 
    />
  )
})

export const Surface = props => {
  const {
    title,
    prefix,
    styles,
    titleStyle,
    capitalize,
    surfaceRef,
    toggleHandel,
    initialToggle,
    RightComponent,
    TitleComponent,
    hasToggle = true,
    className = 'surface',
  } = props

  const surfaceStyles = useStyle('surface', styles)
  const [toggled, setToggled] = useState(initialToggle || true)

  const onTogglePress = useCallback(
    (event, setValue) => {
      const value = exists(setValue) ? setValue : !toggled
      setToggled(value)
    },
    [toggled, setToggled]
  )

  useEffect(() => {
    checkCall(toggleHandel, setToggled)
  }, [toggleHandel, setToggled])

  return (
    <SurfaceMain
      ref={surfaceRef}
      accessibilityRole='region'
      style={surfaceStyles?.main}
      className={`${className ? className : ''} surface-main`}
    >
      {(title || prefix) && (
        <SurfaceHeader
          prefix={prefix}
          title={title}
          toggled={toggled}
          hasToggle={hasToggle}
          titleStyle={titleStyle}
          capitalize={capitalize}
          onTogglePress={onTogglePress}
          styles={surfaceStyles?.header}
          TitleComponent={TitleComponent}
          RightComponent={RightComponent}
        />
      )}
      {(hasToggle && (
        <Drawer
          className='surface-drawer'
          styles={surfaceStyles.drawer}
          toggled={toggled}
        >
          <SCContent
            children={props.children} 
            style={surfaceStyles?.content}
          />
        </Drawer>
      )) || (
        <SCContent
          children={props.children} 
          style={surfaceStyles?.content}
        />
      )}
    </SurfaceMain>
  )
}
