import React, { useEffect, useRef, useCallback } from 'react'
import { Animated } from 'react-native'
import { noOpObj } from '@keg-hub/jsutils'

const useAnimatedFlash = (props, opacity, opacityValue) => {
  const {
    flashing=true,
    duration=500,
    maxOpacity=1,
    minOpacity=0,
    delayVisible=300,
    delayInvisible=0,
  } = props
  
  const animatedFlash = useCallback(() => {
    const toValue = opacityValue.current === maxOpacity ? minOpacity : maxOpacity

    flashing && 
      Animated.timing(opacity.current, {
        toValue,
        duration,
        useNativeDriver: false,
      })
      .start(() => {
        toValue === 1
          ? setTimeout(animatedFlash, delayVisible)
          : setTimeout(animatedFlash, delayInvisible)
      })
  }, [
    flashing,
    duration,
    maxOpacity,
    minOpacity,
    delayVisible,
    delayInvisible,
  ])

  return {
    flashing,
    animatedFlash,
    animatedStyle: {opacity: !flashing ? maxOpacity : opacity.current},
  }
}

export const SlowFlash = (props) => {
  const {
    children,
    maxOpacity=1,
    containerStyle=noOpObj,
    opacity:initialOpacity,
  } = props
  
  const opacityValue = useRef(maxOpacity)
  const opacity = useRef(new Animated.Value(initialOpacity || maxOpacity))
  opacity.current.addListener(({ value }) => opacityValue.current = value)

  const {
    flashing,
    animatedStyle,
    animatedFlash,
  } = useAnimatedFlash(props, opacity, opacityValue)

  useEffect(() => animatedFlash(), [flashing])

  return (
    <Animated.View style={[animatedStyle, containerStyle]}>
      {children}
    </Animated.View>
  )
}

const defaultProps = {
  delayVisible: 300,
  delayInvisible: 0,
  flashing: true,
  duration: 1000,
  containerStyle:noOpObj
}

SlowFlash.defaultProps = defaultProps
