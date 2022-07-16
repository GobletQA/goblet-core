import React from 'react'
import { DrawerToggle } from './drawerToggle'
import { ItemHeader } from '@keg-hub/keg-components'
import { PrefixTitleHeader } from 'HKComponents/labels/prefixTitleHeader'
import { renderFromType } from '@keg-hub/keg-components'

export const SurfaceHeader = props => {
  const {
    title,
    prefix,
    styles,
    toggled,
    titleStyle,
    onTogglePress,
    toggleDisabled,
    hasToggle = true,
    capitalize = true,
    TitleComponent=PrefixTitleHeader,
    RightComponent=(hasToggle && DrawerToggle),
  } = props

  return (
    <ItemHeader
      className='surface-header'
      styles={styles?.itemHeader}
      CenterComponent={
        TitleComponent &&
          renderFromType(TitleComponent, {
            styles: styles,
            titleStyle: titleStyle,
            title: title,
            prefix: prefix,
            capitalize: capitalize,
          })
      }
      RightComponent={
        RightComponent &&
          renderFromType(RightComponent, {
            icons: true,
            styles: styles,
            toggled: toggled,
            onPress: onTogglePress,
            toggleDisabled: toggleDisabled,
          })
      }
    />
  )
}
