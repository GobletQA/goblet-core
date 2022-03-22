import { useCallback, useState, useRef, useEffect } from 'react'
import { isFunc } from '@keg-hub/jsutils'


const MIN_WIDTH = 400

const useEnsureRef = resizeRef => {
  const internalRef = useRef(null)
  const elRef = useCallback(element => {
    internalRef.current = element
    isFunc(resizeRef)
      ? resizeRef(element)
      : (resizeRef.current = element)
  }, [resizeRef, internalRef])

  return {elRef, internalRef}
}

export const useResizeHooks = (resizeRef, initialWidth, minWidth=MIN_WIDTH) => {

  let initialNum = initialWidth
  if(initialNum && initialNum < minWidth) initialNum = minWidth

  const {elRef, internalRef} = useEnsureRef(resizeRef)
  const [dragging, setDragging] = useState(false)
  const [leftWidth, setLeftWidth] = useState(undefined)
  const [separatorXPosition, setSeparatorXPosition] = useState(undefined)

  useEffect(() => {
    !leftWidth &&
      initialNum &&
      setLeftWidth(initialNum)
  }, [initialNum, leftWidth])

  const onMouseDown = useCallback(evt => {
    if(!initialNum) return

    document.body.style.cursor = `none`
    setSeparatorXPosition(evt.clientX)
    setDragging(true)
  }, [initialNum])

  const onTouchStart = useCallback(evt => {
    if(!initialNum) return
    setSeparatorXPosition(evt.touches[0].clientX)
    setDragging(true)
  }, [
    setDragging,
    initialNum,
    setSeparatorXPosition
  ])

  const onMove = useCallback(clientX => {
    if (!initialNum || !dragging || !leftWidth || !separatorXPosition) return

    const newLeftWidth = leftWidth + clientX - separatorXPosition
    setSeparatorXPosition(clientX)

    if (newLeftWidth < minWidth) return setLeftWidth(minWidth)

    const splitPaneWidth = internalRef?.current?.clientWidth
    if (splitPaneWidth && newLeftWidth > splitPaneWidth - minWidth)
      return setLeftWidth(splitPaneWidth - minWidth)

    setLeftWidth(newLeftWidth)

  }, [
    minWidth,
    dragging,
    leftWidth,
    setLeftWidth,
    initialNum,
    separatorXPosition
  ])

  const onMouseMove = useCallback(evt => {
    if(!initialNum) return
    evt?.preventDefault()
    onMove(evt?.clientX)
  }, [onMove, initialNum])

  const onTouchMove = useCallback(evt => {
    if(!initialNum) return
    onMove(evt?.touches[0]?.clientX)
  }, [onMove, initialNum])

  const onMouseUp = useCallback(() => {
    if(!initialNum) return
    document.body.style.cursor = 'auto'
    setDragging(false)
  }, [setDragging, initialNum])

  useEffect(() => {
    if(!initialNum) return
    document.addEventListener(`mousemove`, onMouseMove, true)
    document.addEventListener(`touchmove`, onTouchMove, true)
    document.addEventListener(`mouseup`, onMouseUp, true)
    window.addEventListener(`blur`, onMouseUp, true)

    return () => {
      document.removeEventListener(`mousemove`, onMouseMove, true)
      document.removeEventListener(`touchmove`, onTouchMove, true)
      document.removeEventListener(`mouseup`, onMouseUp, true)
      window.removeEventListener(`blur`, onMouseUp, true)
    }
  }, [
    onMouseUp,
    onMouseMove,
    onTouchMove,
    initialNum,
  ])

  return {
    dragging,
    leftWidth,
    onMouseUp,
    onMouseDown,
    onTouchStart,
    resizeRef: elRef,
  }
}

