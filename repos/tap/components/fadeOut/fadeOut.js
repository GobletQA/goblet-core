import React, { useState, useEffect, useMemo } from 'react'
import { exists } from '@keg-hub/jsutils'
import { useSetTimeout } from 'HKHooks/useSetTimeout'
import { Row, Loading } from '@keg-hub/keg-components'
import { useSelector, shallowEqual } from 'react-redux'
import { Fade, FadeView, FadeSection } from './fadeOut.restyle.js'

/**
 * Hook to get the boolean tigger that starts the fade out
 * @param {boolean} start - Trigger the fadeout from outside the component
 *
 * @param {Boolean} - Trigger that starts the fade out
 */
const useFadeStart = start => {
  const initialized = useSelector(
    store => store?.app?.initialized,
    shallowEqual
  )
  return useMemo(
    () => (exists(start) ? start : initialized),
    [start, initialized]
  )
}

/**
 * Hook to check if the element should fade out
 * If so, then it updates the styles to fade out the element
 * @param {boolean} start - Trigger the fadeout from outside the component
 * @param {Object} styles - Custom styles for the component
 * @param {number} speed - How fast the component should fade out
 *
 * @param {Array} - Styles for the fadeout element
 */
const useFadeEffect = (start, speed, styles) => {
  const [style, setStyle] = useState({ ...(styles?.main || {}), opacity: 1 })

  useEffect(() => {
    start &&
      !style.display &&
      style.opacity === 1 &&
      setStyle({ ...style, opacity: 0 })
  }, [start, style])

  useSetTimeout(
    () => setStyle({ ...style, display: 'none' }),
    speed,
    start && style.display !== 'none'
  )

  return [style, setStyle]
}

/**
 * Component to cover it's parent, then fade out after a given amount of time
 * @param {Object} props
 * @param {string} props.color - Background color of the covering element
 * @param {boolean} [props.start] - Trigger the fadeout from outside the component
 * @param {Object} [props.styles] - Custom styles for the component
 * @param {number} [props.speed] - How fast the component should fade out
 */
export const FadeOut = ({ children, color, start, styles, speed = 1000 }) => {
  const fadeStart = useFadeStart(start)
  const [fadeStyle] = useFadeEffect(fadeStart, speed, styles)

  return (
    <Fade
      color={color}
      speed={speed}
      style={fadeStyle}
      className='fade-out-main'
    >
      <FadeSection style={styles?.section}>
        <Row style={styles?.row}>
          <FadeView>{children || <Loading />}</FadeView>
        </Row>
      </FadeSection>
    </Fade>
  )
}
