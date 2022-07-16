import React from 'react'
import { useThemeHover, useStylesCallback } from '@keg-hub/re-theme'
import {
  ReHandle,
  ReContainer,
  ReIcon,
  ReContent,
} from './resize.restyle'

/**
 * Update to use the correct colors from the theme
 */
 const styleCB = (theme) => ({
  hover: {
    content: {
      bgC: theme?.colors.palette?.blue02,
    },
    icon: {
      color: theme?.colors?.palette?.white01,
    }
  },
  default: {
    icon: {
      color: theme?.tapColors?.backGround,
    }
  }
})

export const ResizeHandle = props => {
  const {
    dragging,
    onMouseUp,
    onMouseDown,
    onTouchStart
  } = props

  const styles = useStylesCallback(styleCB)
  const [hoverRef, style] = useThemeHover(
    styles.default,
    styles.hover
  )

  const handleStyle = dragging ? styles.hover : style

  return (
    <ReHandle
      ref={hoverRef}
      onTouchEnd={onMouseUp}
      style={handleStyle?.content}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      className="goblet-resize-handle"
    >
      <ReContainer className='resize-handle-container'>
        <ReContent
          style={handleStyle?.content}
          className='resize-handle-content'
        >
          <ReIcon
            className='resize-handle-icon'
            svgFill={handleStyle?.icon?.color}
            width={10}
            height={15}
          />
        </ReContent>
      </ReContainer>
    </ReHandle>
  )
}