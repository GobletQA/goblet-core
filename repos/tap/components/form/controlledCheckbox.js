import React, {forwardRef, useCallback, useRef} from 'react'
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

  const onTouch = useCallback(() => {
    
    console.log(ref)
    
    onChange?.({ target: { checked: !checked } })
  }, [checked, onChange, ref])


  return (
    <ReContainer className='controlled-checkbox-container' >
      {preInline && InlineComponent && (
        <ReInlineText className='controlled-checkbox-pre-inline' >
          {InlineComponent}
        </ReInlineText>
      )}
      {Wrapper ? (
        <Wrapper>
          <ReCheckbox
            ref={ref}
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