import React, {forwardRef} from 'react'
import { InputHoc } from './inputHoc'
import {
  RePreside,
  RePostside,
  ReContainer,
  ReCheckbox,
  ReInlineText
} from './form.restyle'

const ControlledCheck = forwardRef((props, ref) => {
  const {
    styles,
    preInline,
    postInline,
    InlineComponent,
    ...checkboxProps
  } = props

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
        <Wrapper>
          <ReCheckbox
            ref={ref}
            className='controlled-checkbox'
            styles={styles?.checkbox}
            {...checkboxProps}
          />
        </Wrapper>
      ):(
        <ReCheckbox
          ref={ref}
          className='controlled-checkbox'
          styles={styles?.checkbox}
          {...checkboxProps}
        />
      )}
      {postInline && InlineComponent && (
        <ReInlineText className='controlled-checkbox-post-inline' >
          {InlineComponent}
        </ReInlineText>
      )}
    </ReContainer>
  )
})

ControlledCheck.displayName = 'Checkbox'
export const ControlledCheckbox = InputHoc(ControlledCheck)