import React, { useCallback, useState, useRef } from 'react'
import { Canvas } from './canvas'
import { noOpObj } from '@keg-hub/jsutils'
import { ScreencastTabs } from './screencastTabs'
import { Recorder } from 'HKComponents/recorder/recorder'
import { useNoVnc, useScreencastUrl } from 'HKHooks/screencast'
import { ResizeHandle } from 'HKComponents/resize/resizeHandle'
import { useResizeHooks } from 'HKComponents/resize/useResizeHooks'
import {
  SCMain,
  LSurface,
  RSurface,
  CanvasCover,
} from './screencast.restyle'

const useTabSelect = (activeTab, setActiveTab) => {
  return useCallback(tab => {
    activeTab !== tab && setActiveTab(tab)
    return true
  }, [activeTab, setActiveTab])
}

export const Screencast = props => {
  const {
    screenId,
    isRunning,
    activeTab,
    activeFile,
  } = props

  // TODO: @lance-tipton - extract this to a helper
  // Only show record button for waypoint and unit test file types
  const showRecord = activeFile.fileType === `waypoint` || activeFile.fileType === `unit`

  const [tab, setTab] = useState(activeTab)
  const tabSelect = useTabSelect(tab, setTab)

  const canvasRef = useRef(null)
  const screencastUrl = useScreencastUrl()

  const { connected, screenRect } = useNoVnc(
    canvasRef && canvasRef.current,
    screencastUrl,
    noOpObj
  )

  const parentRef = useRef(null)
  const {
    dragging,
    leftWidth,
    onMouseUp,
    onMouseDown,
    onTouchStart,
  } = useResizeHooks(parentRef, screenRect.width, 400)

  return (
    <SCMain className='screencast-main'>
      <LSurface
        hasToggle={false}
        capitalize={false}
        leftWidth={leftWidth}
        className={`screencast-recorder-surface`}
      >
        <Recorder
          screenId={screenId}
          isRunning={isRunning}
          activeFile={activeFile}
        />
      </LSurface>
      <ResizeHandle
        dragging={dragging}
        onTouchEnd={onMouseUp}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
      />
      <RSurface
        hasToggle={false}
        capitalize={false}
        prefix={'Screencast'}
        title={'Test Runner'}
        className={`screencast-canvas-surface`}
      >
        <Canvas
          canvasRef={canvasRef}
          isConnected={connected}
          width={screenRect.width}
          height={screenRect.height}
        />
        {dragging && (<CanvasCover className='screencast-canvas-cover' />)}
      </RSurface>
      <ScreencastTabs
        activeTab={tab}
        isRunning={isRunning}
        canvasRef={canvasRef}
        showRecord={showRecord}
        onTabSelect={tabSelect}
      />
    </SCMain>
  )
}


