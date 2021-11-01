import React, {useMemo} from 'react'
import { Values } from 'SVConstants'
import { CanvasMain } from './screencast.restyle'
import { Loading, Row } from '@keg-hub/keg-components'

const { SCREENCAST_CANVAS } = Values

/**
 * Canvas for Rendering NoVNC
 */
export const Canvas = React.forwardRef((props, ref) => {
  const {
    width,
    height,
    isConnected,
  } = props

  return (
    <CanvasMain
      ref={ref}
      tabIndex={0}
      id={SCREENCAST_CANVAS}
      className='sc-canvas-main'
      style={{
        display: 'initial',
        width,
        height,
      }}
    >
      {!isConnected && (<Loading />)}
    </CanvasMain>
  )
})