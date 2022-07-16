import React, { useEffect, useState, useMemo } from 'react'
import { isFunc } from '@keg-hub/jsutils'
import { Tabbar } from 'HKComponents/tabbar'
import { View } from '@keg-hub/keg-components'
import { useOnTabSelect } from 'HKHooks/tabs/useOnTabSelect'
import { RunTestsButton } from 'HKComponents/buttons/runTestsButton'

const ignoreTabs = [`editor-actions`]

/**
 * EditorActions Component - Displays editor screen actions for updating test files
 * @param {Object} props
 */
const EditorActions = props => {
  const {
    onRun,
    actionStyles,
  } = props

  return (
    <View style={actionStyles?.main} className={`editor-tab-actions`}>
      {onRun && (
        <View style={actionStyles?.run} className={`editor-tab-actions-save`}>
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
 * @param {String} EditorActions - React Component to render the test actions
 * @param {Object} options - Options for configuring the tabs
 *
 * @returns {Array} - Tabs to be rendered for the Editor Component
 */
const useActionsTab = (
  tabs,
  EditorActions,
  {
    onRun,
    onSave,
    styles,
    showRun,
    isSaving,
    screenId,
    activeFile,
    showEditorTabs,
  }
) =>
  useMemo(() => {
    const extraActionTabs = [
      {
        onSave,
        isSaving,
        screenId,
        activeFile,
        showEditorTabs,
        Tab: EditorActions,
        id: ignoreTabs[0],
        disableTab: true,
        ...(showRun && { onRun }),
        tabStyle: {
          main: {
            cursor: 'auto',
            paddingRight: 20,
            justifyContent: 'end',
          }
        },
        actionStyles: styles?.default,
      },
    ]

    return showEditorTabs
      ? Object.values(tabs)
        .reduce((acc, tab) => {
            !tab.disabled && acc.push(tab)
            return acc
          }, [])
          .concat(extraActionTabs)
      : extraActionTabs
  }, [
    tabs,
    onRun,
    onSave,
    styles,
    showRun,
    EditorActions,
    isSaving,
    showEditorTabs,
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

  const barTabs = useActionsTab(tabs, EditorActions, props)

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
