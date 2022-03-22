import React from 'react'
import { InputHoc } from './inputHoc'
import {
  ReSelect,
  ReOption,
} from './form.restyle'


/**
 * Creates the component based on the options passed in
 * @param {Array<{label:string, value:string}>} props.options - options to display
 * @returns
 */
 const generateOptions = options => {
  return options.map((option, index) => {
    return <ReOption key={index} label={option?.label} value={option?.value} />
  })
}

const ControlledSel = props => {
  const {
    styles,
    options,
    ...selectProps
  } = props

  return (
    <ReSelect
      styles={styles?.select}
      {...selectProps}
    >
      {generateOptions(options)}
    </ReSelect>
  )
}

ControlledSel.displayName = 'Select'
export const ControlledSelect = InputHoc(ControlledSel)