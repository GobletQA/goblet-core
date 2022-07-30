
import { DEF_HOST_IP } from '../constants/constants'
import { toNum, deepMerge, exists, isEmptyColl } from '@keg-hub/jsutils'
import {
  TDockerConfig,
  TProxyConfig,
  TServerConfig,
  TConductorOpts,
  TConductorConfig
} from '../types'

type TPartialConf = Record<any, any>

const {
  CD_TIMEOUT=5000,
  CD_SERVER_SECRET,
  CD_PIDS_LIMIT=500,
  CD_PROXY_PORT=9901,
  CD_RATE_LIMIT=5000,
  CD_LOG_LEVEL=`info`,
  // Salting the user hash string. Not intended to be secure, just anonymous
  CD_HASH_KEY=`C0nDuc10R`,
  CD_PROXY_HOST=DEF_HOST_IP,
  CD_PROXY_DOMAIN=CD_PROXY_HOST
} = process.env

export const config:TConductorConfig = {
  controller: {
    options: {},
    pidsLimit: toNum(CD_PIDS_LIMIT) as number,
  } as TDockerConfig,
  proxy: {
    host: CD_PROXY_HOST,
    hashKey: CD_HASH_KEY,
    secret: CD_SERVER_SECRET,
    logLevel: CD_LOG_LEVEL || `info`,
    domain: CD_PROXY_DOMAIN || CD_PROXY_HOST,
    timeout: (toNum(CD_TIMEOUT) || 5000) as number,
    rateLimit: (toNum(CD_RATE_LIMIT) || 5000) as number,
  } as TProxyConfig,
  server: {
    host: CD_PROXY_HOST,
    logLevel: CD_LOG_LEVEL || `info`,
    port: (toNum(CD_PROXY_PORT) || 9901) as number,
    rateLimit: (toNum(CD_RATE_LIMIT) || 5000) as number,
  } as TServerConfig,
}

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
  const mergedConfig = deepMerge(config, inConfig) as TConductorConfig
  return loopEnsure(mergedConfig, config)  as TConductorConfig
}