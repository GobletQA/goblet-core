import React, {forwardRef, useCallback, createRef } from 'react'
import { InputHoc } from './inputHoc'
import {
  RePreside,
  RePostside,
  ReContainer,
  ReCheckbox,
  ReInlineText,
  ReInlineTouch
} from './form.restyle'

const ControlledCheck = forwardRef((props, ref) => {
  const {
    styles,
    checked,
    onChange,
    preInline,
    postInline,
    InlineComponent,
    ...checkboxProps
  } = props

  const Wrapper = preInline
    ? RePostside
    : postInline && RePreside

  const checkRef = ref || createRef()

  const onTouch = useCallback((event) => {
    const invert = !checked
    checkRef?.current?.setChecked(invert)
    onChange?.({target: {checked: invert}})
  }, [checked, onChange, checkRef])


  return (
    <ReContainer className='controlled-checkbox-container' >
      {preInline && InlineComponent && (
        <ReInlineText className='controlled-checkbox-pre-inline' >
          {InlineComponent}
        </ReInlineText>
      )}
      {Wrapper ? (
        <Wrapper style={styles?.wrapper} >
          <ReCheckbox
            ref={checkRef}
            checked={checked}
            onChange={onChange}
            className='controlled-checkbox'
            styles={styles?.checkbox}
            {...checkboxProps}
          />
        </Wrapper>
      ):(
        <ReCheckbox
          ref={ref}
          checked={checked}
          onChange={onChange}
          className='controlled-checkbox'
          styles={styles?.checkbox}
          {...checkboxProps}
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

ControlledCheck.displayName = 'Checkbox'
export const ControlledCheckbox = InputHoc(ControlledCheck)