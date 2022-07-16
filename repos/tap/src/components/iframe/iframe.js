import { exists, noOpObj } from '@keg-hub/jsutils'
import { ReIframe } from './iframe.restyle'
import { useStyle } from '@keg-hub/re-theme'
import React, { useEffect, useState } from 'react'

/**
 * Helper to emit click events that are sent from the iframe
 * This lets us know the IFrame was clicked on
 * Useful for cases like closing the open sidebar when the iframe is clicked
 */
const emitIframeClick = () => {
  window.dispatchEvent(
    new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: true,
    })
  )
}

/**
 * Helper to update the IFrame height to match the height of the iframe document
 * @param {string} sentHeight - Height of the iframe document
 * @param {function} setFrameStyle - Method to update the iframe height stored in state
 */
const updateHeight = (sentHeight, setFrameStyle) => {
  exists(sentHeight) && setFrameStyle({ height: `${sentHeight}px` })
}

/**
 * Iframe
 * @param {Object} props
 * @param {string} props.src - url src to load into iframe
 * @param {object} props.styles - Styles for the iframe element
 */
export const Iframe = React.forwardRef((props, ref) => {
  const { style, styles, ...args } = props

  const [frameStyle, setFrameStyle] = useState(noOpObj)

  useEffect(() => {
    // Event listener handler for post message events from the child iframe
    const onMessage = event => {
      event?.data?.gobletIframeClick
        ? emitIframeClick()
        : updateHeight(event?.data?.gobletIframeHeight, setFrameStyle)
    }

    // Add listener to the window
    window.addEventListener('message', onMessage)

    // Remove the listener on unmount
    return () => window.removeEventListener('message', onMessage)
  }, [])

  const mainStyles = useStyle(style, frameStyle)
  return <ReIframe {...args} ref={ref} style={mainStyles} />
})
