import React, { useEffect, useState, useMemo } from 'react'
import { Tabbar } from 'HKComponents/tabbar'
import { View } from '@keg-hub/keg-components'
import { useOnTabSelect } from 'HKHooks/tabs/useOnTabSelect'
import { isFunc, noPropArr, noOpObj } from '@keg-hub/jsutils'
import { RunTestsButton } from 'HKComponents/buttons/runTestsButton'

const ignoreTabs = [`test-actions`]

/**
 * TestActions Component - Displays reports screen actions for updating test files
 * @param {Object} props
 */
const TestActions = props => {
  const { actionStyles = noOpObj, onRun } = props

  // TODO: Update only show RunTestsButton if there is a related test file
  return (
    <View style={actionStyles?.main} className={`reports-tab-actions`}>
      <View style={actionStyles?.run} className={`reports-tab-actions-save`}>
        <RunTestsButton
          onRun={onRun}
          runAllTests={false}
          text={`Re-Run Tests`}
        />
      </View>
    </View>
  )
}

/**
 * Helper hook to memoizing the tabs to be displayed
 * @param {Object} tabs - Tabs for the Editor screen
 * @param {String} TestActions - React Component to render the test actions
 * @param {Object} options - Options for configuring the tabs
 *
 * @returns {Array} - Tabs to be rendered for the Editor Component
 */
const useActionsTab = (tabs = noPropArr, TestActions, { onRun, styles }) =>
  useMemo(() => {
    const extraActionTabs = [
      {
        onRun,
        id: `test-actions`,
        Tab: TestActions,
        disableTab: true,
        actionStyles: styles?.default,
      },
    ]

    return tabs.concat(extraActionTabs)
  }, [tabs, onRun, styles, TestActions])

/**
 * EditorTabs Component - Displays the tabs for the reports screen
 * @param {Object} props
 * @param {Object} props.activeTab - Currently active tab
 * @param {Object} props.onTabSelect - Callback for when the tab is changed
 */
export const ReportsTabs = props => {
  const { activeTab, onTabSelect, tabs = noPropArr } = props

  const [tab, setTab] = useState(activeTab)
  const tabSelect = useOnTabSelect(tab, setTab, onTabSelect, ignoreTabs)

  useEffect(() => {
    isFunc(onTabSelect) && activeTab !== tab && setTab(activeTab)
  }, [activeTab, onTabSelect, tab, setTab])

  const barTabs = useActionsTab(tabs, TestActions, props)

  return (
    <Tabbar
      type='reports'
      fixed
      tabs={barTabs}
      activeTab={tab}
      location='bottom'
      onTabSelect={tabSelect}
    />
  )
}
