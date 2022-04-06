import React, {forwardRef} from 'react'
import { InputHoc } from './inputHoc'
import {
  ReSwitch
} from './form.restyle'

const ControlledSw = forwardRef((props, ref) => {
  const {
    styles,
    ...switchProps
  } = props

  return (
    <ReSwitch
      ref={ref}
      styles={styles?.switch}
      {...switchProps}
    />
  )
})

ControlledSw.displayName = 'Switch'
export const ControlledSwitch = InputHoc(ControlledSw)