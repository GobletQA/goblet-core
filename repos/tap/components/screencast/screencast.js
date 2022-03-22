import React, { useCallback, useState, useRef } from 'react'
import { Canvas } from './canvas'
import { noOpObj } from '@keg-hub/jsutils'
import { ScreencastTabs } from './screencastTabs'
import { Tracker } from 'HKComponents/tracker/tracker'
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
    isRunning,
    activeTab,
    activeFile,
    hideTracker,
  } = props

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
        prefix={'Screencast'}
        title={'Test Runner'}
        leftWidth={leftWidth}
        className={`screencast-canvas-surface`}
      >
        <Canvas
          canvasRef={canvasRef}
          isConnected={connected}
          width={screenRect.width}
          height={screenRect.height}
        />
        {dragging && (<CanvasCover className='screencast-canvas-cover' />)}
      </LSurface>
      {!hideTracker && (
        <>
          <ResizeHandle
            dragging={dragging}
            onTouchEnd={onMouseUp}
            onMouseDown={onMouseDown}
            onTouchStart={onTouchStart}
          />
          <RSurface
            hasToggle={false}
            capitalize={false}
            prefix={'Tracker'}
            title={'Tests Status'}
            className={`screencast-tracker-surface`}
          >
            <Tracker
              isRunning={isRunning}
              activeFile={activeFile}
            />
          </RSurface>
          <ScreencastTabs
            activeTab={tab}
            isRunning={isRunning}
            canvasRef={canvasRef}
            onTabSelect={tabSelect}
          />
        </>
      )}
    </SCMain>
  )
}
