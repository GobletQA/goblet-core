
import { deepMerge, exists, isEmptyColl } from '@keg-hub/jsutils'
import { TConductorOpts, TConductorConfig } from '@gobletqa/conductor/types'
import { conductorConfig } from '@gobletqa/conductor/configs/conductor.config'

type TPartialConf = Record<any, any>

const loopEnsure = (mergedConfig:TPartialConf, config:TPartialConf) => {
  let tracker = config
  return Object.entries(mergedConfig)
    .reduce((acc, [key, value]) => {
      acc[key] = exists(value) ? value : tracker[key]

      if(key === 'options' && isEmptyColl(acc[key]))
        acc[key] = {socketPath: '/var/run/docker.sock'}

      else if(key !== 'images' && typeof acc[key] === 'object'){
        tracker = tracker?.[key]
        acc[key] = loopEnsure(acc[key], tracker)
      }

      return acc
    }, {}) as TPartialConf
}

export const buildConfig = (inConfig:TConductorOpts):TConductorConfig => {
  const mergedConfig = deepMerge(conductorConfig, inConfig) as TConductorConfig
  return loopEnsure(mergedConfig, conductorConfig)  as TConductorConfig
}