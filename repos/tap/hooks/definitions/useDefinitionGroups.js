import { useMemo } from 'react'
import { Edit } from 'HKAssets/icons/edit'
import { Copy } from 'HKAssets/icons/copy'
import { reduceObj, deepClone } from '@keg-hub/jsutils'

/**
 * Default group object for splitting up step definitions
 * @private
 * @type {Object}
 */
const defaultGroups = {
  lookup: {},
  all: { type: 'all', group: 'All Steps', toggled: false, items: [] },
  given: { type: 'given', group: 'Given Steps', toggled: true, items: [] },
  when: { type: 'when', group: 'When Steps', toggled: false, items: [] },
  then: { type: 'then', group: 'Then Steps', toggled: false, items: [] },
}

/**
 * Sorts the passed in array of items alphabetically based on each items title property
 * @private
 * @param {Array<Object>} items - Group of objects with a title property
 *
 * @return {Object} - Items sorted alphabetically
 */
const alphaSort = items => {
  items.sort((a, b) => {
    const textA = a.title.toLowerCase()
    const textB = b.title.toLowerCase()
    return textA < textB ? -1 : textA > textB ? 1 : 0
  })

  return items
}

/**
 * Sorts each definition group type alphabetically
 * Also sorts the all group by definition type
 * @private
 * @param {Object} grouped - Groups of step definitions separated by type
 *
 * @return {Object} - Sorted Groups of definitions alphabetically and by type
 */
const sortDefinitions = grouped => {
  grouped.all.items.sort((a, b) => {
    const textA = a.title.toLowerCase()
    const textB = b.title.toLowerCase()
    const aWhen = textA.startsWith('when')
    const bThen = textB.startsWith('then')
    const aThen = textA.startsWith('then')
    const bWhen = textB.startsWith('when')

    if (aWhen && bThen) return -1
    if (aThen && bWhen) return 1

    return textA < textB ? -1 : textA > textB ? 1 : 0
  })

  grouped.given.items = alphaSort(grouped.given.items)
  grouped.when.items = alphaSort(grouped.when.items)
  grouped.then.items = alphaSort(grouped.then.items)

  return grouped
}

/**
 * Maps the definitions to a format that can be loaded by the SimpleList Component
 * Separates them by type, and creates a lookup map
 * @private
 * @param {Object} definitions - Groups of step definitions to search separated by type
 *
 * @return {Object} - Mapped definitions into SimpleList formatted object
 */
export const useDefinitionGroups = (definitions) => {
  return useMemo(() => {
    return reduceObj(
      definitions,
      (key, defs, grouped) => {
        defs.map(def => {
          const itemProps = {
            title: `${def.type} ${def.name}`,
            uuid: def.uuid,
            meta: def.meta,
            actions: [
              {
                name: 'Copy',
                key: `action-copy`,
                iconProps: {
                  size: 12,
                  Component: Copy,
                },
              },
              {
                name: 'Edit',
                key: `action-edit`,
                iconProps: {
                  size: 12,
                  Component: Edit,
                },
              },
            ],
          }
          grouped[key].items.push(itemProps)
          grouped.all.items.push(itemProps)
          grouped.lookup[def.uuid] = def
        })

        return sortDefinitions(grouped)
      },
      deepClone(defaultGroups)
    )
  }, [definitions])
}
