import { camelCase, noOpObj, exists } from '@keg-hub/jsutils'

type TMapOpts = {
  addNew?: boolean
  overwrite?: boolean
  replaceOnlyEmpty?: boolean
}

type TValuesObj = Record<string, any>

type TMapValues = {
  opts?:TMapOpts
  values:TValuesObj
  existing?:TValuesObj
}

/**
 * Adds the key value to the passed in acc object
 * Also adds a camelCase version of the key for ease of use
 */
const setValue = (acc:TValuesObj, key:string, value:any) => {
  acc[key] = value
  acc[camelCase(key)] = value

  return acc
}

/**
 * Maps loaded values to the passed in existing values object
 * Overwrites values based on options
 */
export const mapValues = ({
  values,
  existing=noOpObj,
  opts=noOpObj as TMapOpts,
}:TMapValues) => {

  const {
    addNew=true,
    overwrite=true,
    replaceOnlyEmpty,
  } = opts

  return Object.entries(values)
    .reduce((acc, [key, value]) => {
      const keyExists = Boolean(key in acc)

      // If key doesn't exist, add the value is addNew is true, otherwise skip
      if(!keyExists)
        return addNew ? setValue(acc, key, value) : acc

      // If key exists but is falsy
      // Only replace if replaceOnlyEmpty is true
      if(exists(replaceOnlyEmpty))
        return replaceOnlyEmpty === false
          ? setValue(acc, key, value)
          : acc[key] === ''
            ? setValue(acc, key, value)
            : acc

      // Else if key exists and overwrite true then replace, otherwise skip
      // Should never be hit when process.env is passed because replaceOnlyEmpty should always exists
      return overwrite ? setValue(acc, key, value) : acc

    }, existing as TValuesObj)
}