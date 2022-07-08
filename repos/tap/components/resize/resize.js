import React, {useRef} from 'react'
import { camelCase, noOpObj } from '@keg-hub/jsutils'
import { 
  ReResize,
  ReTHandle,
  ReLHandle,
  ReRHandle,
  ReBHandle,
  ReTLHandle,
  ReTRHandle,
  ReBLHandle,
  ReBRHandle
} from './resize.restyle'


const createOriginal = props => {
  return {
    w: 0,
    h: 0,
    mX: 0,
    mY: 0,
    oX: 0,
    oY: 0,
    ...props,
    minWidth: props.minWidth || 200,
    minHeight: props.minHeight || props.minWidth || 200,
  }
}

const setDims = (element, dims) => {
  Object.entries(dims)
  .map(([style, value]) => value && (element.style[style] = `${value}px`))
}

const sideUpdaters = {
  ['top-left']: (evt, element, original) => {
    const width = original.w - (evt.pageX - original.mX)
    const height = original.h - (evt.pageY - original.mY)
    const setW = width > original.minWidth
    const setH = height > original.minHeight

    setDims(element, {
      width: setW && width,
      height: setH && height,
      top: setH && (original.oY + (evt.pageY - original.mY)),
      left: setW && (original.oX + (evt.pageX - original.mX))
    })
  },
  ['top-right']: (evt, element, original) => {
    const width = original.w + (evt.pageX - original.mX)
    const height = original.h - (evt.pageY - original.mY)
    const setH = height > original.minHeight
    
    setDims(element, {
      height: setH && height,
      width: (width > original.minWidth) && width,
      top: setH && (original.oY + (evt.pageY - original.mY))
    })
  },
  ['bottom-left']: (evt, element, original) => {
    const width = original.w - (evt.pageX - original.mX)
    const height = original.h + (evt.pageY - original.mY)
    const setW = width > original.minWidth

    setDims(element, {
      width: setW && width,
      height: (height > original.minHeight) && height,
      left: setW && (original.oX + (evt.pageX - original.mX))
    })
  },
  ['bottom-right']: (evt, element, original) => {
    const width = original.w + (evt.pageX - original.mX)
    const height = original.h + (evt.pageY - original.mY)
    
    setDims(element, {
      width: (width > original.minWidth) && width,
      height: (height > original.minHeight) && height,
    })
  },
  left: (evt, element, original) => {
    const width = original.w - (evt.pageX - original.mX)
    const setW = width > original.minWidth
    setDims(element, {
      width: setW && width,
      left: setW && (original.oX + (evt.pageX - original.mX))
    })
  },
  right: (evt, element, original) => {
    const width = original.w + (evt.pageX - original.mX)
    setDims(element, {
      width: (width > original.minWidth) && width,
    })
  },
  top: (evt, element, original) => {
    const height = original.h - (evt.pageY - original.mY)
    const setH = height > original.minHeight

    setDims(element, {
      height: setH && height,
      top: setH && (original.oY + (evt.pageY - original.mY)),
    })
  },
  bottom: (evt, element, original) => {
    setDims(element, {
      height: (height > original.minHeight) && (original.h + (evt.pageY - original.mY)),
    })
  }
}

const resizeAction = (handel, element, original, evt) => {
  Object.entries(sideUpdaters)
    .map(([side, method]) => {
      original[camelCase(side)] &&
        handel.classList.contains(side) &&
        method(evt, element, original)
    })
}

const useResize = props => {
  return useRef(element =>  {
    if(!element) return

    const original = createOriginal(props)
    const handles = [...element.querySelectorAll('.resizer')]
    handles.map(handel => {
      handel.addEventListener('mousedown', evt => {
        evt.preventDefault()
        original.mX = evt.pageX
        original.mY = evt.pageY

        const boundingRect = element.getBoundingClientRect()
        original.oX = boundingRect.left
        original.oY = boundingRect.top

        const computedStyle = getComputedStyle(element, null)
        original.w = parseFloat(computedStyle.getPropertyValue('width').replace('px', ''))
        original.h = parseFloat(computedStyle.getPropertyValue('height').replace('px', ''))
        
        const resize = resizeAction.bind(window, handel, element, original)
        window.addEventListener('mousemove', resize)
        window.addEventListener('mouseup', () => window.removeEventListener('mousemove', resize))
      })
    })
  }).current
}


export const Resize = props => {
  const {
    children,
    className,
    style=noOpObj,
    prefix=`goblet`,
    ...posProps
  } = props

  const elementRef = useResize(posProps)

  return (
    <ReResize
      style={style}
      ref={elementRef}
      className={`${prefix}-resize-main ${className || ''}`.trim()}
    >
      {children}
      {posProps.top && (<ReTHandle className='resizer top' />)}
      {posProps.left && (<ReLHandle className='resizer left' />)}
      {posProps.right && (<ReRHandle className='resizer right' />)}
      {posProps.bottom && (<ReBHandle className='resizer bottom' />)}
      {posProps.topLeft && (<ReTLHandle className='resizer top-left' />)}
      {posProps.topRight && (<ReTRHandle className='resizer top-right' />)}
      {posProps.bottomLeft && (<ReBLHandle className='resizer bottom-left' />)}
      {posProps.bottomRight && (<ReBRHandle className='resizer bottom-right' />)}
    </ReResize>
  )
}