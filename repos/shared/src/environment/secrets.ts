

// TODO: update this to load repo specific secrets
// Should be considered secure - Still figuring out what that looks like
// Need to add git encryption to secrets files
import './ensureGobletEnv'
import path from 'path'
import { values } from './values'
import { mapValues } from './mapValues'
import { loadEnvFile } from './loadEnvFile'
import { deepFreeze, noOpObj } from '@keg-hub/jsutils'
import { configFromParent } from './configFromParent'
import { getReplaceOnlyEmpty } from './getReplaceOnlyEmpty'
import { getPathFromConfig } from '../utils/getPathFromConfig'

// goblet.config.js
const { GOBLET_ENV=`develop` } = process.env

const loadRepoEnvs = (config:any) => {
  const environmentsDir = getPathFromConfig(`environmentsDir`, config)

  let secrets =  mapValues({
    existing: {},
    values: loadEnvFile({
      location: path.join(environmentsDir, `secrets.env`),
    }),
  })

  if(GOBLET_ENV)
    secrets = mapValues({
      existing: secrets,
      values: loadEnvFile({
        location: path.join(environmentsDir, `secrets.${GOBLET_ENV}.env`),
      }),
    })

  /**
  * Add secrets from the current process
  * Only add ENVs where the keys already exist in the secrets object ( i.e. addNew )
  */
  secrets = mapValues({
    existing: secrets,
    values: process.env,
    opts: {
      addNew: false,
      replaceOnlyEmpty: getReplaceOnlyEmpty(values.GOBLET_REPLACE_ONLY_EMPTY),
    },
  })

  return deepFreeze(secrets)
}

const config = configFromParent(module, {
  startsWith: [`/keg/tap/`]
})

const secrets = config ? loadRepoEnvs(config): noOpObj

export { secrets }