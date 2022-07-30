import { noOpObj } from '@keg-hub/jsutils'
import { useState, useRef, useEffect } from 'react'

const defSize = {
  height: parseInt(process.env.GB_VNC_VIEW_HEIGHT) || 900,
  width: parseInt(process.env.GB_VNC_VIEW_WIDTH) || 1440,
}

defSize.ratio = defSize.width / defSize.height

export const sizeFromRatio = ({ height, width }) => {
  const size = { ...defSize }

  if (height < size.height) {
    size.height = height
    size.width = defSize.ratio * height
  }
  if (width < size.width) {
    size.width = width
    size.height = width / defSize.ratio
  }

  return {
    width: Math.round(size.width),
    height: Math.round(size.height),
  }
}

export const useScreenResize = (element, screenSize = noOpObj) => {
  const [screenRect, setScreenRect] = useState(screenSize)
  const screenRef = useRef()

  useEffect(() => {
    if (element && !screenRef.current) screenRef.current = element
    if (!screenRef.current) return

    const canvasParentEl = screenRef.current.parentNode
    const rect = canvasParentEl.getBoundingClientRect()

    setScreenRect(
      sizeFromRatio({
        width: rect.width,
        height: rect.height,
      })
    )

    const observer = new ResizeObserver(entries => {
      const contentRect = entries[0]?.contentRect
      if (!contentRect) return

      const boundingRect = canvasParentEl.getBoundingClientRect()
      setScreenRect(
        sizeFromRatio({
          width: boundingRect.width,
          height: boundingRect.height,
        })
      )

      window.requestAnimationFrame(() =>
        window.dispatchEvent(new UIEvent('resize'))
      )
    })

    observer.observe(canvasParentEl)

    return () => observer.unobserve(canvasParentEl)
  }, [element, screenRef, setScreenRect])

  return {
    screenRef,
    screenRect,
    setScreenRect,
  }
}
