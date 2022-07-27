import { TConductorOpts } from '../options.types'
import { deepMerge, exists, isEmptyColl } from '@keg-hub/jsutils'
import { TConductorConfig } from '../conductor.types'
import { config }  from '@GCDConfigs/conductor.config'

type TPartialConf = Record<any, any>

const loopEnsure = (mergedConfig:TPartialConf, config:TPartialConf) => {
  let tracker = config
  return Object.entries(mergedConfig).reduce((acc, [key, value]) => {
    acc[key] = exists(value) ? value : tracker[key]

    if(key === 'connect' && isEmptyColl(acc[key]))
      acc[key] = {socketPath: '/var/run/docker.sock'}

    else if(typeof acc[key] === 'object'){
      tracker = tracker[key]
      return loopEnsure(acc[key], tracker)
    }

    return acc
  }, {}) as TPartialConf
}


export const buildConfig = (inConfig:TConductorOpts):TConductorConfig => {
  const mergedConfig = deepMerge(config, inConfig) as TConductorConfig
  return loopEnsure(mergedConfig, config)  as TConductorConfig
}