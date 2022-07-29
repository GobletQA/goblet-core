import { DEF_HOST_IP } from '../constants'
import { TConductorConfig } from '../types'

export const getDomain = (config:TConductorConfig) => {
  return config?.proxy?.domain
    || config?.proxy?.host
    || config?.server?.host
    || DEF_HOST_IP
}