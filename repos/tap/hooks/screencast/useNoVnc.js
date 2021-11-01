import { useState, useEffect } from 'react'
import { useScreenResize } from './useScreenResize'
import { NoVncService } from 'SVServices/noVncService'
/**
 * Helper to initialize noVNC service 
 * @param {Object} element - Dom element to attach the canvas to
 * @param {string} vncUrl - Url to connect to the VNC websocket
 * @param {Object} creds - Credentials to connect to the VNC websocket
 *
 * @returns {Object} - Contains an instance of the NoVncService
 */
export const useNoVnc = (element, vncUrl, creds) => {
  const [noVnc, setNoVnc] = useState(null)
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    setNoVnc(new NoVncService(setConnected))
  }, [])

  const {
    screenRef,
    screenRect,
    setScreenRect,
  } = useScreenResize(element)

  useEffect(() => {
    noVnc &&
      element &&
      vncUrl &&
      noVnc.init(element, vncUrl, creds)

    return () => noVnc && noVnc.disconnect()
  }, [
    creds,
    noVnc,
    vncUrl,
    element,
  ])

  return {
    noVnc, 
    connected,
    screenRef,
    screenRect,
    setScreenRect,
  }
}
