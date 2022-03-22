import React, { useEffect, useRef, useCallback } from 'react'
import { InputHoc } from './inputHoc'
import { Input } from '@keg-hub/keg-components'

/**
 * Input component
 * @param {Object} props
 * @param {Array<{label:string, value:string}>} props.options - options to display
 * @returns
 */
const ControlledIn = props => {
  const {
    value,
    styles,
    onChange,
    className,
    ...inputProps
  } = props

  const valueRef = useRef(value)
  const inputRef = props.inputRef || useRef(null)

  const onValChange = useCallback(
    event => onChange?.(event?.target?.value, event),
    [value, onChange]
  )

  useEffect(() => {
    if (valueRef.current === value) return

    valueRef.current = value
    inputRef.current && inputRef.current.focus()
  }, [value, inputRef.current, valueRef.current])


  return (
    <Input
      value={value}
      ref={inputRef}
      onChange={onValChange}
      style={styles?.input}
      {...inputProps}
    />
  )
}

ControlledIn.displayName = 'Input'
export const ControlledInput = InputHoc(ControlledIn)

