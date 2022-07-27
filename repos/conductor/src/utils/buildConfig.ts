import { TConductorOpts } from '../options.types'
import { toNum, deepMerge, exists, isEmptyColl } from '@keg-hub/jsutils'
import { TConductorConfig, TDockerConfig, TProxyConfig } from '../conductor.types'

type TPartialConf = Record<any, any>

const {
  CD_TIMEOUT=5000,
  CD_PIDS_LIMIT=20,
  CD_PROXY_PORT=9901,
  CD_RATE_LIMIT=5000,
  CD_LOG_LEVEL=`info`,
  CD_PROXY_HOST=`0.0.0.0`,
} = process.env

export const config:TConductorConfig = {
  docker: {
    pidsLimit: (toNum(CD_PIDS_LIMIT) || 20) as number,
    connect: {}
  } as TDockerConfig,
  proxy: {
    logLevel: CD_LOG_LEVEL || `info`,
    host: CD_PROXY_HOST || `0.0.0.0`,
    port: (toNum(CD_PROXY_PORT) || 9901) as number,
    timeout: (toNum(CD_TIMEOUT) || 5000) as number,
    rateLimit: (toNum(CD_RATE_LIMIT) || 5000) as number,
  } as TProxyConfig,
}

const loopEnsure = (mergedConfig:TPartialConf, config:TPartialConf) => {
  let tracker = config
  return Object.entries(mergedConfig)
    .reduce((acc, [key, value]) => {
      acc[key] = exists(value) ? value : tracker[key]

      if(key === 'connect' && isEmptyColl(acc[key]))
        acc[key] = {socketPath: '/var/run/docker.sock'}

      else if(key !== 'images' && typeof acc[key] === 'object'){
        tracker = tracker[key]
        acc[key] = loopEnsure(acc[key], tracker)
      }

      return acc
    }, {}) as TPartialConf
}

export const buildConfig = (inConfig:TConductorOpts):TConductorConfig => {
  const mergedConfig = deepMerge(config, inConfig) as TConductorConfig
  return loopEnsure(mergedConfig, config)  as TConductorConfig
}