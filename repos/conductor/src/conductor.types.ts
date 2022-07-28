import { Request } from 'express'
import { Options } from 'http-proxy-middleware'

export type TLogLevel = 'info' | 'warn' | 'error' | 'debug' | 'verbose'

export type TPort = number | string
export type TPorts = TPort[]

export type TContainerConfig = {
  mem: number
  idle: number
  ports?: TPorts
  timeout: number
  rateLimit: number
}

export type TImgConfig = {
  tag: string
  name: string
  provider: string
  pidsLimit?: number
  container: TContainerConfig
}

// TODO: Update this to whatever options end up being correct for spawning a new container
export type TCreateOpts = {
  tag?: string
  name?: string
  provider?: string
  pidsLimit?: number
  container?: TContainerConfig
}

export type TImgsConfig = {
  [key:string]: TImgConfig
}

export type TImgRef = string|TImgConfig

export type TProxyConfig = {
  host?: string
  proxy: Options
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

export type TDockerConfig = TControllerConfig & {
}

export type TControllerType = 'docker' | 'Docker'

export type TControllerConfig = {
  pidsLimit: number
  type: TControllerType
  connect: Record<any, any>
}

export type TConductorConfig = {
  server: TServerConfig
  proxy: TProxyConfig
  images?: TImgsConfig
  controller: TDockerConfig
}

export type TContainerObj = {
  stop: () => Promise<void>
  remove: () => Promise<void>
  [key:string]: any
}

export type TContainerRef = string|TContainerObj

type TPortBinding = {
  HostIP: string
  HostPort: string
}

export type TCreateResponse = {
  image: Record<any, any>
  container: TContainerObj
  ports: Record<string, TPortBinding[]>
}


export type TContainerRoute = {
  host: string
  port: string|number
  protocol?: 'http' | 'https'
}