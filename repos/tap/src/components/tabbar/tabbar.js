import React, { useMemo, useCallback, useState, useEffect } from 'react'
import { TabChildren } from './tabChildren'
import { useStyle } from '@keg-hub/re-theme'
import { TabbarMain } from './tabbar.restyle'
import { isFunc, noOpObj } from '@keg-hub/jsutils'

/**
 * Hooks to Set the active tab id when a tab is selected
 * Calls the onTabSelect method when it exists
 * If onTabSelect returns true, updating the active tab ID is skipped
 * @param {Array} tabs - Tab Objects that can be selected
 * @param {function} onTabSelect - Callback for when a tab is selected
 * @param {function} setActiveId - Method to update the active Tab ID
 *
 * @returns {function} - Callback function for when a tab is clicked
 */
const useTabSelect = (tabs, onTabSelect, setActiveId) =>
  useCallback(
    async id => {
      if (!tabs) return

      // Call the event hook, and if it returns true, then skip the state update
      const skip = isFunc(onTabSelect) ? await onTabSelect(id, tabs) : false

      // If nothing is returned, then update the tab id
      skip !== true && setActiveId(id)
    },
    [tabs, onTabSelect]
  )

/**
 * Finds the active tab object from the passed in activeTab id
 * @param {Array} tabs - Tab Objects that can be selected
 * @param {string|number} activeId - The active tabs ID
 *
 * @returns {Object} - Found activeTab Object
 */
const useCurrentTab = (tabs, activeId) =>
  useMemo(() => tabs.find(tab => tab.id === activeId), [tabs, activeId])

/**
 * Finds the active tab object from the passed in activeTab id
 * @param {Array} tabs - Tab Objects that can be selected
 * @param {string|number} activeId - The active tabs ID
 * @param {function} setActiveId - Method to update the active Tab ID
 *
 * @returns {Void}
 */
const useCheckActiveTab = (activeTab, activeId, setActiveId) =>
  useEffect(() => {
    activeTab !== activeId && setActiveId(activeTab)
  }, [activeTab, activeId, setActiveId])

/**
 *
 * @param {Object} props
 * @param {string} props.activeTab - active tab id
 * @param {Object} props.location - default 'bottom'
 * @param {Boolean} props.fixed
 * @param {Function} props.onTabSelect
 * @param {Array} props.tabs
 * @param {string} props.type
 */
export const Tabbar = props => {
  const {
    tabs,
    fixed,
    activeTab,
    onTabSelect,
    type=`default`,
    location = 'bottom',
  } = props

  const barStyles = useStyle(`tabbar.${type}`)
  const [activeId, setActiveId] = useState(activeTab)
  const CurrentTab = useCurrentTab(tabs, activeId)

  const onSelectTab = useTabSelect(tabs, onTabSelect, setActiveId)

  useCheckActiveTab(activeTab, activeId, setActiveId)

  return (
    <TabbarMain className='tabbar-main' style={barStyles.main}>
      {tabs && (
        <TabChildren
          tabs={tabs}
          fixed={fixed}
          styles={barStyles}
          activeId={activeId}
          location={location}
          CurrentTab={CurrentTab}
          onSelectTab={onSelectTab}
        />
      )}
    </TabbarMain>
  )
}
