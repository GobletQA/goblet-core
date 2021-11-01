import React, { useCallback, useEffect, useState } from 'react'
import { Tabbar, RunTestsButton } from 'SVComponents'
import { Browser, TimesFilled } from 'SVAssets/icons'
import { useOnTabSelect } from 'SVHooks/tabs/useOnTabSelect'
import { isFunc, checkCall, noOpObj } from '@keg-hub/jsutils'
import { HerkinButton } from 'SVComponents/buttons/button.restyle'
import { stopBrowser } from 'SVActions/screencast/api/stopBrowser'
import { ActionsContainer, ActionMain } from './screencast.restyle'
import { restartBrowser } from 'SVActions/screencast/api/restartBrowser'

const tabs = []
const tabsIgnore = [`test-actions`]

const useHandleEvent = (cb, data=noOpObj) => {
  return useCallback((event) => {
    event.stopPropagation()
    event.preventDefault()
    checkCall(cb, data, event)
  }, [cb, data])
}

// TODO: Add browser actions and button here
// Eventually the start and stop buttons will be removed
// Need to resolve watching the browser status properly first
// This works for now
const TestActions = props => {
  const onRestartBrowser = useHandleEvent(restartBrowser)
  const onStopBrowser = useHandleEvent(stopBrowser)

  return (
    <ActionsContainer className='screencast-tab-actions'>
      <ActionMain className='screencast-tab-action-start' >
        <HerkinButton
          type='primary'
          Icon={Browser}
          onClick={onRestartBrowser}
        >
          Start Browser
        </HerkinButton>
      </ActionMain>
      <ActionMain className='screencast-tab-action-stop' >
        <HerkinButton
          type='danger'
          Icon={TimesFilled}
          onClick={onStopBrowser}
        >
          Stop Browser
        </HerkinButton>
      </ActionMain>
      <ActionMain className='screencast-tab-action-run' >
        <RunTestsButton
          runAllTests={false}
          autoChangeScreen={false}
          text={`Run Tests`}
        />
      </ActionMain>
    </ActionsContainer>
  )
}

export const ScreencastTabs = props => {

  const {
    onRun,
    canvasRef,
    activeTab,
    onTabSelect,
    // TODO: Pass in all custom actions for interacting with the screencast browser
    actions,
  } = props

  const [tab, setTab] = useState(activeTab)

  const onSelectTab = useOnTabSelect(tab, setTab, onTabSelect, tabsIgnore)
  
  useEffect(() => {
    isFunc(onTabSelect) &&
      activeTab !== tab &&
      setTab(activeTab)
  }, [activeTab, onTabSelect, tab, setTab])

  return (
    <Tabbar
      type='code'
      activeTab={tab}
      location='bottom'
      onTabSelect={onSelectTab}
      tabs={[ ...tabs, { onRun, id: `test-actions`, Tab: TestActions }]}
    />
  )
  
}