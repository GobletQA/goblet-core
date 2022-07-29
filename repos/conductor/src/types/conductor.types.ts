import { Request } from 'express'
import { DockerOptions } from 'dockerode'
import { Options } from 'http-proxy-middleware'

export type TContainerLabels = Record<string, string>

export type TContainerConfig = {
  mem: number
  idle: number
  ports?: TPorts
  timeout: number
  rateLimit: number
  envs?: Record<string, string|boolean|number>
}

export type TImgConfig = {
  tag: string
  name: string
  user?: string
  uri?: string
  provider: string
  pidsLimit?: number
  container: TContainerConfig
}

export type TCreatePortsObj = {
  ports: Record<any, any>
  exposed: Record<string, Record<any, any>>
  bindings: Record<string, Record<'HostPort', string>[]>
}

export type TImgsConfig = {
  [key:string]: TImgConfig
}

export type TImgRef = string | TImgConfig

export type TDockerAuth = {
  key?: string
  auth?: string,
  email?: string,
  username?: string,
  password?: string,
  serveraddress?: string
}

export type TPullOpts = {
  [key:string]: any
  authconfig: TDockerAuth
}

export type TDockerConfig = TControllerConfig & {
}

export type TControllerType = 'docker' | 'Docker'

export type TControllerConfig = DockerOptions & {
  pidsLimit: number
  type: TControllerType
  options:DockerOptions
}

export type TLogLevel = 'info' | 'warn' | 'error' | 'debug' | 'verbose'

export type TPort = number | string
export type TPorts = TPort[]
export type TPortsMap = Record<string, string>

export type TProxyConfig = {
  host?: string
  domain?:string
  proxy: Options
  hashKey: string
  timeout: number
  rateLimit: number
  logLevel: TLogLevel
  proxyRouter:(req:Request) => Record<any, any>|string
}

export type TServerConfig = {
  port: number,
  host?: string,
  rateLimit: number
  logLevel: TLogLevel
}

export type TConductorConfig = {
  server: TServerConfig
  proxy: TProxyConfig
  images?: TImgsConfig
  controller: TDockerConfig
}


export type TSpawnOpts = {
  imageRef: string
  tag?: string
  name?: string
  user?: string
  provider?: string
  [key: string]: any
}
