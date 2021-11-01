import React, { useCallback, useState, useEffect } from 'react'
import { useStyle } from '@keg-hub/re-theme'
import { DrawerToggle } from './drawerToggle'
import { SurfaceHeader } from './surfaceHeader'
import { checkCall, exists } from '@keg-hub/jsutils'
import { Drawer, Row } from '@keg-hub/keg-components'

import { SurfaceContent, SurfaceMain } from './surface.restyle'

export const Surface = props => {
  const {
    capitalize,
    prefix,
    styles,
    title,
    titleStyle,
    hasToggle,
    toggleHandel,
    initialToggle,
    toggleDisabled,
    RightComponent,
    TitleComponent,
    className='surface',
  } = props

  const surfaceStyles = useStyle('surface', styles)
  const [ toggled, setToggled ] = useState(initialToggle || true)

  const onTogglePress = useCallback((event, setValue) => {
    const value = exists(setValue) ? setValue : !toggled

    setToggled(value)
  }, [ toggled, setToggled ])

  useEffect(() => {
    checkCall(toggleHandel, setToggled)
  }, [toggleHandel, setToggled])

  const SCContent = (
    <Row
      children={props.children}
      style={surfaceStyles?.content}
    />
  )

  return (
    <SurfaceMain
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
          RightComponent={RightComponent}
          TitleComponent={TitleComponent}
        />
      )}
      {hasToggle && (
        <Drawer
          className='surface-drawer'
          styles={ surfaceStyles.drawer }
          toggled={ toggled }
        >
          {SCContent}
        </Drawer>
      ) || SCContent}
    </SurfaceMain>
  )
}