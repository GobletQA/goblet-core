import { FormAside } from './formAside'
import React, { forwardRef } from 'react'
import { useStyle } from '@keg-hub/re-theme'
import {
  ReMain,
  ReLabel,
  ReRequired,
  ReContainer,
  ReErrorText,
  ReHelperText,
  ReLabelText,
} from './form.restyle'

/**
 * Input Higher Order Component - Wraps a form input for extra meta data components
 * @param {Object|Function} Component - The Form component being wrapped
 * @param {Object|Function} RootComponent - The Root component that wraps the passed in Component
 *
 */
export const InputHoc = (Component, RootComponent=ReMain) => {
  const InputComp = forwardRef((props, ref) => {
    const {
      post,
      Aside,
      zIndex,
      title,
      error,
      helper,
      styles,
      required,
      preHelper,
      asideProps,
      ...inputProps
    } = props

    const asideStyles = useStyle(
      'form.input.aside',
      styles?.aside,
      asideProps?.style
    )

    return (
      <RootComponent style={styles?.main} zIndex={zIndex} >
        {title && (
          <ReLabel style={styles?.label}>
            <ReLabelText>
              {title}
              {required && (<ReRequired>*</ReRequired>)}
            </ReLabelText>
            {error && (<ReErrorText children={error} />)}
          </ReLabel>
        )}
        {preHelper && (
          <ReHelperText children={preHelper} />
        )}
        <ReContainer style={styles?.container}>
          {!post && Aside && (
            <FormAside
              className={`goblet-pre-input-aside`}
              {...asideProps}
              Aside={Aside}
              style={asideStyles}
            />
          )}
          <Component
            {...inputProps}
            styles={styles}
            required={required}
            {...(Aside && { type: post ? 'post' : 'pre' })}
            ref={ref}
          />
          {post && Aside && (
            <FormAside
              post
              Aside={Aside}
              {...asideProps}
              style={asideStyles}
              className={`goblet-post-input-aside`}
            />
          )}
        </ReContainer>
        {helper && (
          <ReHelperText children={helper} className='goblet-input-helper-text' />
        )}
      </RootComponent>
    )
  })

  InputComp.displayName = `InputHoc(${Component.name || Component.displayName || 'FormComponent'})`

  return InputComp
}