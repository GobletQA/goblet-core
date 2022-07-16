import { useMemo } from 'react'
import { noOpObj } from '@keg-hub/jsutils'

export const useClassNames = (classNames, prefix) => {
  return useMemo(() => {
    return (
      (classNames &&
        Object.entries(classNames).reduce((acc, [key, value]) => {
          acc[key] = `${prefix}-${value}`
          return acc
        }, {})) ||
      noOpObj
    )
  }, [classNames, prefix])
}
