import React, { useCallback, useEffect, useState } from 'react'
import { Values } from 'HKConstants'
import { isFunc } from '@keg-hub/jsutils'
import { Tabbar } from 'HKComponents/tabbar'
import { useOnTabSelect } from 'HKHooks/tabs/useOnTabSelect'

const { DEFINITION_TABS } = Values

/**
 * Tabs that can be selected
 * @type {Object}
 */
const tabs = [
  {
    id: DEFINITION_TABS.LIST,
    title: `List`,
  },
  {
    id: DEFINITION_TABS.ACTIVE,
    title: `Active`,
  },
]

/**
 * Tabs at the top of the Definitions List / Active Definition section to toggle between them
 * @param {Object} prop
 * @param {string} prop.activeTab - Initial Tab name to be active
 * @param {function} prop.onTabSelect - Called when a tab is selected
 *
 */
export const DefinitionTabs = React.memo(props => {
  const { activeTab, onTabSelect } = props
  const [tab, setTab] = useState(activeTab)
  const tabSelect = useOnTabSelect(tab, setTab, onTabSelect)

  useEffect(() => {
    isFunc(onTabSelect) && activeTab !== tab && setTab(activeTab)
  }, [activeTab, onTabSelect, tab, setTab])

  return (
    <Tabbar
      tabs={tabs}
      location='top'
      activeTab={tab}
      type='definitions'
      onTabSelect={tabSelect}
    />
  )
})
