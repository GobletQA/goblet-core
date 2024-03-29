import React, { useState, useCallback } from 'react'
import { Subheader } from '../subheader'
import { noOpObj } from '@keg-hub/jsutils'
import { useStyle } from '@keg-hub/re-theme'
import { DrawerToggle } from './drawerToggle'
import { Grid, Row, View, Drawer } from '@keg-hub/keg-components'

export const SubSurface = props => {
  const {
    title,
    prefix,
    children,
    initialToggle,
    styles = noOpObj,
    toggleDisabled,
    classNames = noOpObj,
  } = props

  const surfaceStyles = useStyle('subsurface', styles)

  const [toggled, setToggled] = useState(initialToggle || true)

  const onTogglePress = useCallback(
    event => {
      setToggled(!toggled)
    },
    [toggled, setToggled]
  )

  return (
    <Grid className={classNames.main} style={surfaceStyles.main}>
      <Row className={classNames.headerRow} style={surfaceStyles.headerRow}>
        <Subheader
          classNames={classNames.header}
          styles={surfaceStyles.header}
          prefix={prefix}
          title={title}
        >
          <DrawerToggle
            onPress={onTogglePress}
            toggled={toggled}
            styles={surfaceStyles}
            toggleDisabled={toggleDisabled}
          />
        </Subheader>
      </Row>
      <Drawer
        className='sub-surface-drawer'
        styles={surfaceStyles.drawer}
        toggled={toggled}
      >
        <Row
          className={classNames.containerRow}
          style={surfaceStyles.containerRow}
        >
          <View
            className={classNames.container}
            style={surfaceStyles.container}
          >
            {children}
          </View>
        </Row>
      </Drawer>
    </Grid>
  )
}
