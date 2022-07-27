import { TPorts, TImgConfig, TContainerConfig, TLogLevel } from './conductor.types'

export type TContainerOpts = TContainerConfig & {
  mem?: number
  idle?: number
  ports?: TPorts
  timeout?: number
  rateLimit?: number 
}

export type TImgOpts = TImgConfig & {
  container?: TContainerOpts
}

export type TImagesOpts = {
  [key:string]: TImgOpts
}

export type TDockerOpts = {
  pidsLimit?: number
  connect?: Record<any, any>
}

export type TProxyOpts = {
  host?: string
  timeout?: number
  rateLimit?: number
  logLevel?: TLogLevel
  port?: string | number
}

export type TConductorOpts = {
  proxy?: TProxyOpts
  docker?:TDockerOpts
  images:  TImagesOpts
}
