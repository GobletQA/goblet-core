import React, {forwardRef, useCallback, createRef } from 'react'
import { InputHoc } from './inputHoc'
import {
  ReSwitch,
  RePreside,
  RePostside,
  ReContainer,
  ReInlineText,
  ReInlineTouch,
} from './form.restyle'

const ControlledSw = forwardRef((props, ref) => {
  const {
    styles,
    checked,
    onChange,
    preInline,
    postInline,
    InlineComponent,
    ...switchProps
  } = props

  const checkRef = ref || createRef()

  const onTouch = useCallback((event) => {
    const invert = !checked
    checkRef?.current?.setChecked(invert)
    onChange?.({target: {checked: invert}})
  }, [checked, onChange, checkRef])

  const Wrapper = preInline
    ? RePostside
    : postInline && RePreside


  return (
    <ReContainer className='controlled-checkbox-container' >
      {preInline && InlineComponent && (
        <ReInlineText className='controlled-checkbox-pre-inline' >
          {InlineComponent}
        </ReInlineText>
      )}
      {Wrapper ? (
        <Wrapper style={styles?.wrapper} >
          <ReSwitch
            ref={ref}
            checked={checked}
            onChange={onChange}
            className='controlled-switch'
            styles={styles?.switch}
            {...switchProps}
          />
        </Wrapper>
      ):(
        <ReSwitch
          ref={ref}
          checked={checked}
          onChange={onChange}
          className='controlled-switch'
          styles={styles?.switch}
          {...switchProps}
        />
      )}
      {postInline && InlineComponent && (
        <ReInlineTouch
          onPress={onTouch}
          showFeedback={true}
          className='controlled-checkbox-inline-touch'
        >
          <ReInlineText className='controlled-checkbox-post-inline' >
            {InlineComponent}
          </ReInlineText>
        </ReInlineTouch>
      )}
    </ReContainer>
  )
})

ControlledSw.displayName = 'Switch'
export const ControlledSwitch = InputHoc(ControlledSw)