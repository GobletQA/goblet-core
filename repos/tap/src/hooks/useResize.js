import React, { useEffect, useMemo, useState, useCallback, useRef} from 'react'
import { noOpObj, isFunc } from '@keg-hub/jsutils'

const cursor = {
  both: 'nwse-resize',
  vertical: 'ns-resize',
  horizontal: 'ew-resize'
}

const useEnsureRef = props => {
  const { resizeRef } = props
  const internalRef = useRef(null)
  const elRef = useCallback(element => {
    internalRef.current = element
    isFunc(resizeRef)
      ? resizeRef(element)
      : (resizeRef.current = element)
  }, [resizeRef, internalRef])

  return {elRef, ref: internalRef}
}

export const useResize = props => {

  const {elRef, ref} = useEnsureRef(props)
  

  const initResize = useCallback(() => {
    
  }, [ref])

  const cursor = useMemo(() => {
    return !props.resizeX
    ? 'ns-resize'
    : !props.resizeY
      ? 'ew-resize'
      : 'nwse-resize'
  }, [props.resizeX, props.resizeY])

  return {
    cursor,
    initResize,
    resizeRef: elRef,
  }
}
