import { toNum } from '@keg-hub/jsutils'
import { images } from './images.config'
import { TConductorConfig, TDockerConfig, TProxyConfig } from '../src/conductor.types'

const {
  CD_TIMEOUT=5000,
  CD_PIDS_LIMIT=20,
  CD_PROXY_PORT=9901,
  CD_RATE_LIMIT=5000,
  CD_LOG_LEVEL=`info`,
  CD_PROXY_HOST=`0.0.0.0`,
} = process.env

export const config:TConductorConfig = {
  images,
  docker: {
    pidsLimit: (toNum(CD_PIDS_LIMIT) || 20) as number,
    connect: {
      socketPath: '/var/run/docker.sock'
    }
  } as TDockerConfig,
  proxy: {
    logLevel: CD_LOG_LEVEL || `info`,
    host: CD_PROXY_HOST || `0.0.0.0`,
    port: (toNum(CD_PROXY_PORT) || 9901) as number,
    timeout: (toNum(CD_TIMEOUT) || 5000) as number,
    rateLimit: (toNum(CD_RATE_LIMIT) || 5000) as number,
  } as TProxyConfig,
}

