
import { toNum } from '@keg-hub/jsutils'
import { DEF_HOST_IP } from '@gobletqa/conductor/constants/constants'
import {
  TDockerConfig,
  TProxyConfig,
  TServerConfig,
  TConductorConfig
} from '@gobletqa/conductor/types'

const {
  GB_CD_TIMEOUT,
  GB_CD_LOG_LEVEL,
  GB_CD_PIDS_LIMIT,
  GB_CD_PROXY_PORT,
  GB_CD_RATE_LIMIT,
  GB_CD_SERVER_SECRET,
  // Salting the user hash string. Not intended to be secure, just anonymous
  GB_CD_HASH_KEY,
  GB_CD_PROXY_HOST=DEF_HOST_IP,
  GB_CD_PROXY_DOMAIN=GB_CD_PROXY_HOST
} = process.env

export const conductorConfig:TConductorConfig = {
  controller: {
    options: {},
    pidsLimit: toNum(GB_CD_PIDS_LIMIT) as number,
  } as TDockerConfig,
  proxy: {
    host: GB_CD_PROXY_HOST,
    hashKey: GB_CD_HASH_KEY,
    secret: GB_CD_SERVER_SECRET,
    logLevel: GB_CD_LOG_LEVEL,
    domain: GB_CD_PROXY_DOMAIN,
    timeout: (toNum(GB_CD_TIMEOUT) || 5000) as number,
    rateLimit: (toNum(GB_CD_RATE_LIMIT) || 5000) as number,
  } as TProxyConfig,
  server: {
    host: GB_CD_PROXY_HOST,
    logLevel: GB_CD_LOG_LEVEL,
    port: (toNum(GB_CD_PROXY_PORT) || 9901) as number,
    rateLimit: (toNum(GB_CD_RATE_LIMIT) || 5000) as number,
  } as TServerConfig,
}