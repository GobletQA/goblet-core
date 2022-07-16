import React, { useCallback, useState } from 'react'
import { useStyle } from '@keg-hub/re-theme'
import { ChevronDown } from 'HKAssets/icons/chevronDown'
import { View } from '@keg-hub/keg-components'
import { noOpObj, reduceObj } from '@keg-hub/jsutils'
import { DefinitionListItem } from './definitionListItem'
import { SimpleList } from 'HKComponents/list/simpleList'
import { DefinitionListFilter } from './definitionListFilter'
import { useDefinitionGroups } from 'HKHooks/definitions/useDefinitionGroups'
import { addStepFromDefinition } from 'HKActions/features/local/addStepFromDefinition'

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
export const DefinitionList = React.memo(props => {
  const {
    definitions,
    feature,
    contextRef,
    activeDefinition,
    onEditDefinition,
    styles = noOpObj,
  } = props

  const [filterValue, setFilterValue] = useState(null)
  const onFilterUpdate = useCallback(
    evt => {
      const val = evt.target.value
      !val
        ? setFilterValue(null)
        : filterValue !== val && setFilterValue(val.toLowerCase())
    },
    [filterValue]
  )

  const { lookup, ...groupedDefs } = useDefinitionGroups(definitions)

  const [listItems, setListItems] = useState(groupedDefs)

  const onItemPress = useCallback(
    (event, item) => {
      // TODO: feature and context are not currently used
      // Right now it just copies the text to the clipboard
      // Lookup the definition from the lookup table using the uuid
      // Then add it to the active feature by calling the addStepFromDefinition action
      const definition = lookup[item.uuid]
      const actionType = event?.currentTarget?.dataset?.type
      switch(actionType){
        case `copy`: {
          return definition
            ? addStepFromDefinition({
                feature,
                definition,
                clipboard: true,
                context: contextRef.current,
              })
            : console.warn(`Could not find matching definition for item:`, item)
        }
        case `edit`: {
          return activeDefinition !== definition &&
            onEditDefinition?.(definition)
        }
        default: {
          console.warn(`Unknown action type for item:`, item)
        }
      }

    },
    [
      lookup,
      feature,
      onEditDefinition,
      activeDefinition,
      contextRef.current,
    ]
  )

  const onHeaderPress = useCallback(
    (event, meta) => {
      const listItemsCopy = {}
      const activeGroup = reduceObj(
        listItems,
        (key, group, updated) => {
          const active = updated || (group.toggled && group)
          listItemsCopy[key] = {
            ...group,
            // Update all other groups toggled to false in the same iteration
            // Allows only looping over the groups once
            toggled: group.type === meta.type && !meta.toggled,
          }
          return active
        },
        false
      )

      // Update the list items with a new version
      // Which includes the updated active group
      setListItems(listItemsCopy)
    },
    [listItems]
  )

  const listStyles = useStyle(`definitions.list`, styles)
  const definitionListItem = useCallback(
    props => <DefinitionListItem {...props} />,
    []
  )

  // TODO: The simple-list is rendering all items even when hidden
  // Need to update to only render displayed items
  return (
    <View className={`definition-list-main`} style={listStyles.main}>
      <DefinitionListFilter onBlur={onFilterUpdate} />
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
})
