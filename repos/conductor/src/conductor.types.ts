import { Request } from 'express'
import { Options } from 'http-proxy-middleware'
import {
  Image,
  Container,
  ContainerInfo,
  DockerOptions,
  ContainerInspectInfo,
} from 'dockerode'

export type TContainerLabels = Record<string, string>

export type TContainerConfig = {
  mem: number
  idle: number
  ports?: TPorts
  timeout: number
  rateLimit: number
  envs?: Record<string, string>
}

export type TImageObj = Image & {
  [key:string]: any
}

export type TContainerInspect = ContainerInspectInfo & {}
export type TContainerInfo = ContainerInfo & {}

export type TContainerObj = Container & {
  [key:string]: any
}

export type TContainerRef = string | TContainerObj


export type TImgConfig = {
  tag: string
  name: string
  user?: string
  uri?: string
  provider: string
  pidsLimit?: number
  container: TContainerConfig
}


// TODO: Update this to whatever options end up being correct for spawning a new container
export type TCreateOpts = {
  tag?: string
  name?: string
  user?: string
  provider?: string
  pidsLimit?: number
  container?: TContainerConfig
  hostConfig?: Record<any, any>
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

export type TConductorConfig = {
  server: TServerConfig
  proxy: TProxyConfig
  images?: TImgsConfig
  controller: TDockerConfig
}

type TPortBinding = {
  HostIP: string
  HostPort: string
}

export type TRunResponse = {
  urls: TUrls
  ports: TPortsMap
  routes: TProxyRoutes
  image: Record<any, any>
  container: TContainerObj
  containerInfo: TContainerInspect
}

export type TContainerRoute = {
  host: string
  port: string|number
  protocol?: 'http' | 'https'
}

export type TSpawnOpts = {
  imageRef: string
  tag?: string
  name?: string
  user?: string
  provider?: string
  [key: string]: any
}

export type TProxyRoute = {
  host: string,
  protocol: string,
  port: string|number,
}

export type TProxyRoutes = {
  [key:string]: TProxyRoute
}

export type TUrls = {
  [key:string]: string
}