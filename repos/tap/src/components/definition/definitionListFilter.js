import React from 'react'
import { Search } from 'HKAssets/icons/search'
import { reStyle } from '@keg-hub/re-theme/reStyle'
import { ControlledInput } from 'HKComponents/form/controlledInput'

const FilterInput = reStyle(
  ControlledInput,
  'styles'
)(theme => ({
  main: {
    bW: 0,
    borderBottomWidth: 1,
    p: theme.padding.size,
    bC: theme.tapColors.border,
    pV: theme.padding.size * (2 / 3),
  },
  input: {
    otl: 'none',
    borderRadius: 0,
    c: theme.tapColors.defaultDark,
    bgC: theme.tapColors.accentBackground,
  },
}))

/**
 * Filter Input component to filter the Definitions displayed in the list
 * @param {Object} props
 * @param {function} props.onChange - Called when the value of the input is changed
 * @param {function} props.onBlur - Called when the the input is blurred
 *
 */
export const DefinitionListFilter = React.memo(props => {
  const { onChange, onBlur } = props

  return (
    <FilterInput
      Aside={Search}
      onBlur={onBlur}
      onChange={onChange}
      placeholder={`Search Definitions...`}
    />
  )
})
