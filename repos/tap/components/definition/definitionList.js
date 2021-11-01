import React, { useMemo, useCallback, useState, useEffect } from 'react'
import { useStyle } from '@keg-hub/re-theme'
import { ChevronDown, Copy } from 'SVAssets/icons'
import { DefinitionListItem } from './definitionListItem'
import { DefinitionListFilter } from './definitionListFilter'
import { noOpObj, reduceObj, deepClone, exists } from '@keg-hub/jsutils'
import { useDefinitionGroups } from 'SVHooks/definitions/useDefinitionGroups'
import { SimpleList, Row, Text, View, Touchable } from 'SVComponents'
import { addStepFromDefinition } from 'SVActions/features/local/addStepFromDefinition'

/**
 * DefinitionList - Renders a list of Step Definitions
 * @param {Object} props
 * @param {Object} props.definitions - Items to show in the list
 * @param {Object} props.feature - Parent active feature file
 * @param {Object|function} props.contextRef - React ref of the current text editor being used
 * @param {Object} props.styles - Custom styles for displaying the component
 *
 * @returns {Component}
 */
export const DefinitionList = props => {

  const { definitions, feature, contextRef, styles=noOpObj } = props

  const [filterValue, setFilterValue] = useState(null)
  const onFilterUpdate = useCallback((evt) => {
    const val = evt.target.value
    !val
      ? setFilterValue(null)
      : filterValue !== val && setFilterValue(val.toLowerCase())
  }, [filterValue])

  // This hook is too slow, need to speed this up
  const { lookup, ...groupedDefs } = useDefinitionGroups(
    definitions,
    null,
    filterValue
  )

  const [listItems, setListItems] = useState(groupedDefs)

  const onItemPress = useCallback((event, item) => {
    // TODO: feature and context are not currently used
    // Right now it just copies the text to the clipboard
    // Lookup the definition from the lookup table using the uuid
    // Then add it to the active feature by calling the addStepFromDefinition action
    const definition = lookup[item.uuid]
    definition
      ? addStepFromDefinition({
          feature,
          definition,
          clipboard: true,
          context: contextRef.current,
        })
      : console.warn(`Could not find matching definition for item:`, item)
  }, [lookup, feature, contextRef.current])

  const onHeaderPress = useCallback((event, meta) => {
    const listItemsCopy = {}
    const activeGroup = reduceObj(listItems, (key, group, updated) => {
      const active = updated || (group.toggled && group)
      listItemsCopy[key] = {
        ...group,
        // Update all other groups toggled to false in the same iteration
        // Allows only looping over the groups once
        toggled: (group.type === meta.type) && !meta.toggled,
      }
      return active
    }, false)

    // Update the list items with a new version
    // Which includes the updated active group
    setListItems(listItemsCopy)
  }, [listItems])

  const listStyles = useStyle(`definitions.list`, styles)
  const definitionListItem = useCallback(props => (<DefinitionListItem {...props} />), [])

  // The simplelist is rendering all items even when hidden
  // Need to update to only render displayed items
  return (
    <View
      className={`definition-list-main`}
      style={listStyles.main}
    >
      <DefinitionListFilter
        onBlur={onFilterUpdate}
      />
      <SimpleList
        styles={listStyles.list}
        items={listItems}
        filterValue={filterValue}
        renderItem={definitionListItem}
        onHeaderPress={onHeaderPress}
        onItemPress={onItemPress}
        HeaderIcon={ChevronDown}
      />
    </View>
  )
}