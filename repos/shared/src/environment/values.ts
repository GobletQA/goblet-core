// TODO: update this to load repo specific ENV values
// Will not be considered secure
// ADD encryption to and from here
import './ensureGobletEnv'
import path from 'path'
import { mapValues } from './mapValues'
import { loadEnvFile } from './loadEnvFile'
import { deepFreeze, noOpObj } from '@keg-hub/jsutils'
import { configFromParent } from './configFromParent'
import { getReplaceOnlyEmpty } from './getReplaceOnlyEmpty'
import { getPathFromConfig } from '../utils/getPathFromConfig'

const { GOBLET_ENV='develop' } = process.env

const loadRepoValues = (config:any) => {
  const environmentsDir = getPathFromConfig(`environmentsDir`, config)

  let values = mapValues({
    existing: {},
    values: loadEnvFile({
      location: path.join(environmentsDir, `values.env`)
    }),
  })

  if(GOBLET_ENV)
    values = mapValues({
      existing: values,
      values: loadEnvFile({
        location: path.join(environmentsDir, `values.${GOBLET_ENV}.env`)
      }),
    })

  /**
  * Add values from the current process
  * Only add ENVs where the keys already exist in the values object ( i.e. addNew )
  */
  values = mapValues({
    existing: values,
    values: process.env,
    opts: {
      addNew: false,
      replaceOnlyEmpty: getReplaceOnlyEmpty(values.GOBLET_REPLACE_ONLY_EMPTY),
    },
  })

  return deepFreeze(values)
}

const config = configFromParent(module, {
  startsWith: [`/keg/tap/`]
})


const values = config ? loadRepoValues(config) : noOpObj

export { values }