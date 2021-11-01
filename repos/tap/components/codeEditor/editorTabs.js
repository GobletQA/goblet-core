import React, { useEffect, useState, useMemo } from 'react'
import { View } from '@keg-hub/keg-components'
import { isFunc, deepMerge } from '@keg-hub/jsutils'
import { useOnTabSelect } from 'SVHooks/tabs/useOnTabSelect'
import { RunTestsButton, SaveFileButton, Tabbar } from 'SVComponents'

const ignoreTabs = [`test-actions`]

/**
 * TestActions Component - Displays editor screen actions for updating test files
 * @param {Object} props
 */
const TestActions = props => {
  const {
    actionStyles,
    onRun,
    onSave,
    isSaving,
    showFeatureTabs,
    isDefinitionsTab,
  } = props

  return (
    <View
      style={actionStyles.main}
      className={`editor-tab-actions`}
    >
      <View
        style={actionStyles.save}
        className={`editor-tab-actions-save`}
      >
        <SaveFileButton
          disabled={isSaving}
          onSave={onSave}
          className={`editor-tab-actions-save-button`}
        >
          {isSaving ? 'Saving...' : 'Save File'}
        </SaveFileButton>
      </View>
      { onRun && (
        <View
          style={actionStyles.run}
          className={`editor-tab-actions-save`}
        >
          <RunTestsButton
            onRun={onRun}
            checkPending={true}
            runAllTests={false}
          />
        </View>
      )}
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
const useActionsTab = (
  tabs,
  TestActions,
  { onRun, onSave, isSaving, showFeatureTabs, showRun, styles }
) => useMemo(() => {

  const extraActionTabs = [{
    onSave,
    isSaving,
    showFeatureTabs,
    id: `test-actions`,
    Tab: TestActions,
    disableTab: true,
    ...(showRun && { onRun }),
    actionStyles: deepMerge(styles?.default, showRun ? styles?.showRun : null),
  }]

  return showFeatureTabs
    ? Object.values(tabs).concat(extraActionTabs)
    : extraActionTabs

}, [
  tabs,
  onRun,
  onSave,
  styles,
  showRun,
  TestActions,
  isSaving,
  showFeatureTabs,
])


/**
 * EditorTabs Component - Displays the tabs for the editor screen
 * @param {Object} props
 * @param {Object} props.activeTab - Active tab ID
 * @param {Object} props.onTabSelect - Callback for when the tab is changed
 */
export const EditorTabs = props => {
  const { activeTab, onTabSelect, tabs } = props

  const [tab, setTab] = useState(activeTab)
  const tabSelect = useOnTabSelect(tab, setTab, onTabSelect, ignoreTabs)

  useEffect(() => {
    isFunc(onTabSelect) &&
      activeTab !== tab &&
      setTab(activeTab)
  }, [activeTab, onTabSelect, tab, setTab])

  const barTabs = useActionsTab(tabs, TestActions, props)

  return (
    <Tabbar
      fixed
      type='code'
      tabs={barTabs}
      location='bottom'
      activeTab={tab}
      onTabSelect={tabSelect}
    />
  )
  
}