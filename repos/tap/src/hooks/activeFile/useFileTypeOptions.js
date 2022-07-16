import { useMemo } from 'react'
import { Values } from 'HKConstants'
import { mapObj, capitalize, noPropArr, isEmptyColl } from '@keg-hub/jsutils'

/**
 * Goes through the FILE_TYPES constants and creates the options array to pass onto Select Component
 * @returns {Array<{label:string, value:any}>}
 */
export const useFileTypeOptions = () =>
  useMemo(() => {
    return !Values.FILE_TYPES || isEmptyColl(Values.FILE_TYPES)
      ? noPropArr
      : mapObj(Values.FILE_TYPES, (__, val) => ({
          label: capitalize(val),
          value: val,
        }))
  }, [Values.FILE_TYPES])
