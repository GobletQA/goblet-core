import React, { useCallback, useEffect, useState, useMemo } from 'react'
import { Tabbar } from 'HKComponents/tabbar'
import { Browser } from 'HKAssets/icons/browser'
import { useOnTabSelect } from 'HKHooks/tabs/useOnTabSelect'
import { RecordButton } from 'HKComponents/buttons/recordButton'
import { GobletButton } from 'HKComponents/buttons/button.restyle'
import { ActionsContainer, ActionMain } from './screencast.restyle'
import { RunTestsButton } from 'HKComponents/buttons/runTestsButton'
import { actionBrowser } from 'HKActions/screencast/api/actionBrowser'
import { restartBrowser } from 'HKActions/screencast/api/restartBrowser'
import { isFunc, checkCall, noOpObj, noPropArr, noOp } from '@keg-hub/jsutils'

const tabs = []
const tabsIgnore = [`test-actions`]

const useHandleEvent = (cb, data = noOpObj) => {
  return useCallback(
    event => {
      event.stopPropagation()
      event.preventDefault()
      checkCall(cb, data, event)
    },
    [cb, data]
  )
}

const BrowserActions = props => {
  const onRestartBrowser = useHandleEvent(restartBrowser)
  const onActionBrowser = useHandleEvent(actionBrowser)

  return (
    <ActionsContainer className='screencast-tab-actions'>
      <ActionMain className='screencast-tab-action-start'>
        <GobletButton type='primary' Icon={Browser} onClick={onRestartBrowser}>
          Restart Browser
        </GobletButton>
      </ActionMain>
      <ActionMain className='screencast-tab-action-run'>
        <RunTestsButton
          runAllTests={false}
          autoChangeScreen={false}
          text='Run Tests'
        />
      </ActionMain>
    </ActionsContainer>
  )
}

const RecordActions = props => {
  return (
    <ActionsContainer className='screencast-tab-actions'>
      <ActionMain className='screencast-tab-action-record'>
        <RecordButton />
      </ActionMain>
    </ActionsContainer>
  )
}


const useTabs = (tabs = noPropArr, onRun = noOp, showRecord, actions) =>
  useMemo(() => {
    return [
      ...tabs,
      { onRun, id: `browser-actions`, Tab: BrowserActions, clickable: false },
      showRecord && { id: `record-actions`, Tab: RecordActions, clickable: false },
      ...(actions || []),
    ].filter(tab => tab)
  }, [tabs, onRun, actions])

export const ScreencastTabs = props => {
  const {
    onRun,
    activeTab,
    showRecord,
    onTabSelect,
    // TODO: Pass in all custom actions for interacting with the screencast browser
    actions,
  } = props

  const [tab, setTab] = useState(activeTab)

  const tabs = useTabs(tabs, onRun, showRecord, actions)
  const onSelectTab = useOnTabSelect(tab, setTab, onTabSelect, tabsIgnore)

  useEffect(() => {
    isFunc(onTabSelect) && activeTab !== tab && setTab(activeTab)
  }, [activeTab, onTabSelect, tab, setTab])

  return (
    <Tabbar
      type='code'
      tabs={tabs}
      activeTab={tab}
      location='bottom'
      onTabSelect={onSelectTab}
    />
  )
}
