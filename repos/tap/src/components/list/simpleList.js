import React, { useState, useCallback, useMemo, useEffect } from 'react'
import { ListItem } from './listItem'
import { ListHeader } from './listHeader'
import { useStyle } from '@keg-hub/re-theme'
import { exists, noOpObj, checkCall, noPropArr } from '@keg-hub/jsutils'
import { renderFromType, isValidComponent, Grid, Drawer } from '@keg-hub/keg-components'

/**
 * Helper to build the toggled values and callbacks based on passed in props
 * @function
 *
 * @returns {Object} - Built toggle values and callbacks
 */
const useToggled = (meta, propsToggled, drawerToggled, onHeaderPress) => {
  // Get the toggle state if its controlled externally
  const controlledToggle = useMemo(() => {
    return exists(meta.toggled)
      ? meta.toggled
      : exists(drawerToggled)
      ? drawerToggled
      : exists(propsToggled)
      ? propsToggled
      : undefined
  }, [meta.toggled, drawerToggled, propsToggled])

  // Store the initial toggle state
  const [toggled, setToggled] = useState(
    exists(controlledToggle) ? controlledToggle : false
  )

  // Add a callback for toggling the state when header is pressed
  const onTogglePress = useCallback(
    event => {
      checkCall(onHeaderPress, event, meta)
      // If no controlledToggle exists, flip the toggled state
      !exists(controlledToggle) && setToggled(!toggled)
    },
    [onHeaderPress, meta, toggled, controlledToggle]
  )

  // If the toggle state is controlled externally
  // Then validate if it's correct, and update the state if it's not
  // Unfortunately this must be done after the controlledToggle state is updated
  useEffect(() => {
    exists(controlledToggle) &&
      controlledToggle !== toggled &&
      setToggled(controlledToggle)
  }, [toggled, controlledToggle])

  return {
    toggled,
    setToggled,
    onTogglePress,
  }
}

const RenderListItems = props => {
  const {
    items,
    group,
    styles,
    renderItem,
    onItemPress,
    filterValue,
    filterKey = 'title',
  } = props

  return Object.entries(items).reduce((acc, [key, item]) => {
    const itemProps = {
      group,
      styles,
      title: key,
      onItemPress,
      key: `${group}-${key}`,
      ...item,
    }

    ;(!exists(filterValue) ||
      item[filterKey].toLowerCase().includes(filterValue)) &&
      acc.push(
        isValidComponent(renderItem) ? (
          renderFromType(renderItem, itemProps)
        ) : (
          <ListItem {...itemProps} />
        )
      )
    return acc
  }, [])
}

const RenderList = props => {
  const {
    last,
    first,
    styles,
    groupKey,
    iconProps,
    filterKey,
    HeaderIcon,
    renderItem,
    onItemPress,
    filterValue,
    drawer = true,
    header = true,
    meta = noOpObj,
    onHeaderPress,
    drawerProps = noOpObj,
  } = props

  const group = meta.group || groupKey

  const { toggled, setToggled, onTogglePress } = useToggled(
    meta,
    props.toggled,
    drawerProps[groupKey]?.toggled,
    onHeaderPress
  )

  const drawerStyles = useStyle(
    styles?.drawer,
    drawerProps?.styles,
    toggled && styles?.drawer?.toggled,
    toggled && drawerProps?.styles?.toggled
  )

  const RenderedItems = (
    <RenderListItems
      last={last}
      first={first}
      group={group}
      filterKey={filterKey}
      styles={styles?.item}
      renderItem={renderItem}
      onItemPress={onItemPress}
      filterValue={filterValue}
      items={meta.items || noPropArr}
    />
  )

  return (
    <>
      {header && (
        <ListHeader
          last={last}
          first={first}
          title={group}
          Icon={HeaderIcon}
          toggled={toggled}
          iconProps={iconProps}
          onPress={onTogglePress}
          styles={styles?.header}
        />
      )}
      {header && drawer ? (
        <Drawer
          {...drawerProps}
          toggled={toggled}
          styles={drawerStyles}
          className='sub-items-drawer'
        >
          {RenderedItems}
        </Drawer>
      ) : (
        RenderedItems
      )}
    </>
  )
}

export const SimpleList = React.memo(props => {
  const { items, styles } = props
  const listStyles = useStyle(`list`, styles)
  const itemsLength = items.length - 1

  return Object.entries(items).map(([key, meta], index) => {
    return (
      <Grid
        className='simple-list'
        style={listStyles.main}
        key={`${meta.group}-${key}`}
      >
        <RenderList
          {...props}
          meta={meta}
          index={index}
          groupKey={key}
          first={index === 0}
          styles={listStyles}
          last={itemsLength === index}
        />
      </Grid>
    )
  })
})
