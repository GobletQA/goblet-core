export type TPort = number | string
export type TPorts = TPort[]

export type TContainerConfig = {
  mem: number
  idle: number
  ports: TPorts
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

export type TImgsConfig = {
  [key:string]: TImgConfig
}

export type TProxyConfig = {
  port: number,
  host?: string,
  timeout: number
  logLevel: string
  rateLimit: number
}

export type TDockerConfig = {
  pidsLimit: number
  connect: Record<any, any>
}

export type TConductorConf = Record<any, any>

export type TConductorConfig = {
  proxy: TProxyConfig
  images?: TImgsConfig
  docker: TDockerConfig
  conductor: TConductorConf
}

