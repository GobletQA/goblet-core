import React, { useCallback, useState, useRef, useEffect } from "react"
import { Canvas } from './canvas'
import { Tracker } from './tracker'
import { Values } from 'SVConstants'
import { Surface } from 'SVComponents/surface'
import { noOp, noOpObj } from '@keg-hub/jsutils'
import { ScreencastTabs } from './screencastTabs'
import { reStyle } from '@keg-hub/re-theme/reStyle'
import { SCMain, SCContainer } from './screencast.restyle'
import { useStyle, useDimensions } from '@keg-hub/re-theme'
import { PrefixTitleHeader } from 'SVComponents/labels/prefixTitleHeader'

import {
  useNoVnc,
  useScreencastUrl
} from 'SVHooks/screencast'

const { SCREENS } = Values

const useTabSelect = (activeTab, setActiveTab) => useCallback(tab => {
  activeTab !== tab && setActiveTab(tab)
  return true
}, [activeTab, setActiveTab])


export const Screencast = props => {

  const {
    activeFile,
    autoRun=false,
    activeTab,
    parentMethods,
    isRunning,
    prefix,
    styles,
    tests,
    title,
  } = props

  const scStyles = useStyle('screencast', styles)
  const [tab, setTab] = useState(activeTab)
  const tabSelect = useTabSelect(tab, setTab)

  const canvasRef = useRef(null)
  const screencastUrl = useScreencastUrl()

  const {
    connected,
    screenRect
  } = useNoVnc(
    canvasRef && canvasRef.current,
    screencastUrl,
    noOpObj
  )

  return (
    <SCMain className='screencast-main' >
      <Surface
        prefix={'Screencast'}
        capitalize={false}
        title={'Test Runner'}
        hasToggle={false}
        styles={scStyles?.surface?.canvas}
        className={`runner-surface-screencast`}
      >
        <Canvas
          ref={canvasRef}
          isConnected={connected}
          width={screenRect.width}
          height={screenRect.height}
        />
      </Surface>
      <Surface
        prefix={'Tracker'}
        capitalize={false}
        title={'Tests Status'}
        hasToggle={false}
        styles={scStyles?.surface?.tracker}
        className={`tracker-surface-screencast`}
      >
        <Tracker
          isRunning={isRunning}
          activeFile={activeFile}
        />
      </Surface>
      <ScreencastTabs
        activeTab={tab}
        isRunning={isRunning}
        canvasRef={canvasRef}
        onTabSelect={tabSelect}
      />
    </SCMain>
  )
}
