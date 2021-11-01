import React from 'react'
import { View } from 'SVComponents'
import { Input } from 'SVComponents/form/input'
import { reStyle } from '@keg-hub/re-theme/reStyle'

const FilterInput = reStyle(Input, 'styles')(theme => ({
  main: {
    bW: 0,
    borderBottomWidth: 1,
    p: theme.padding.size,
    bC: theme.tapColors.border,
    pV: theme.padding.size * (2/3),
  },
  input: {
    otl: 'none',
    borderRadius: 0,
    c: theme.tapColors.defaultDark,
    bgC: theme.tapColors.accentBackground
  }
}))

/**
 * Filter Input component to filter the Definitions displayed in the list
 * @param {Object} props
 * @param {function} props.onChange - Called when the value of the input is changed
 * @param {function} props.onBlur - Called when the the input is blurred
 *
 */
export const DefinitionListFilter = props => {
  const { onChange, onBlur } = props

  return (
    <FilterInput
      onBlur={onBlur}
      onChange={onChange}
      placeholder={`Filter Definitions...`}
    />
  )
}