import React from 'react'
import { DrawerToggle } from './drawerToggle'
import { ItemHeader } from '@keg-hub/keg-components'
import { PrefixTitleHeader } from 'SVComponents/labels/prefixTitleHeader'

export const SurfaceHeader = props => {
  const {
    capitalize=true,
    prefix,
    styles,
    title,
    titleStyle,
    toggled,
    onTogglePress,
    hasToggle=true,
    toggleDisabled,
    RightComponent=DrawerToggle,
    TitleComponent=PrefixTitleHeader
  } = props

  return (
    <ItemHeader
      className='surface-header'
      styles={styles?.itemHeader}
      CenterComponent={(
        <TitleComponent
          styles={styles}
          titleStyle={titleStyle}
          title={title}
          prefix={prefix}
          capitalize={capitalize}
        />
      )}
      RightComponent={hasToggle && (
        <RightComponent
          onPress={onTogglePress}
          toggled={toggled}
          styles={styles}
          toggleDisabled={toggleDisabled}
          icons={true}
        />
      )}
    />
  )
}