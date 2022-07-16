import React, { useMemo } from 'react'
import { Values } from 'HKConstants'
import { CanvasMain, LoadingMain, LoadingText } from './screencast.restyle'
import { Loading } from '@keg-hub/keg-components'

const { SCREENCAST_CANVAS } = Values

/**
 * Canvas for Rendering NoVNC
 */
export const Canvas = React.memo(props => {
  const {
    width,
    height,
    canvasRef,
    isConnected,
  } = props

  return (
    <>
      <CanvasMain
        tabIndex={0}
        width={width}
        ref={canvasRef}
        height={height}
        id={SCREENCAST_CANVAS}
        className='sc-canvas-main'
      />
      {!isConnected && (
        <LoadingMain>
          <Loading />
          <LoadingText>
            Loading...
          </LoadingText>
        </LoadingMain>
      )}
    </>
  )
})
