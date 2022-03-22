import React from 'react'
import { InputHoc } from './inputHoc'
import { ReAutoComplete } from './form.restyle'

const ControlledAutoComp = props => {
  const {styles, ...autoProps} = props

  return (
    <ReAutoComplete
      styles={styles?.autocomplete}
      {...autoProps}
    />
  )
}

ControlledAutoComp.displayName = 'AutoComplete'
export const ControlledAuto = InputHoc(ControlledAutoComp)
