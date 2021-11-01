import React, { useEffect, useRef } from 'react'
import { 
  Label,
  View,
  Input as KegInput,
} from '@keg-hub/keg-components'
import { reStyle } from '@keg-hub/re-theme/reStyle'

const ReStyleView = reStyle(View)(theme => ({
  padding: theme.padding.size / 2,
}))

/**
 * Input component
 * @param {Object} props
 * @param {Array<{label:string, value:string}>} props.options - options to display
 * @returns
 */
export const Input = props => {
  const {
    value,
    title,
    onBlur,
    styles,
    onChange,
    className,
    placeholder
  } = props

  const valueRef = useRef(value)
  const inputRef = props.inputRef || useRef(null)

  useEffect(() => {
    if(valueRef.current === value) return

    valueRef.current = value
    inputRef.current && inputRef.current.focus()
  }, [ value, inputRef.current, valueRef.current ])

  return (
    <ReStyleView style={styles?.main}>
      {title && (
        <Label style={styles?.label} >
          {title}
        </Label>
      )}
      <KegInput
        value={value}
        ref={inputRef}
        onBlur={onBlur}
        onChange={onChange}
        className={className}
        style={styles?.input}
        placeholder={placeholder}
      />
    </ReStyleView>
  )
}