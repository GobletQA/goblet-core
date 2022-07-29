import { TUrlsMap } from './routes.types'
import { TPortsMap, TContainerConfig } from './conductor.types'
import {
  Image,
  Container,
  ContainerInfo,
  ContainerInspectInfo,
} from 'dockerode'

export type TContainerInspect = ContainerInspectInfo & {}
export type TContainerInfo = ContainerInfo & {}

export type TContainerObj = Container & {
  [key:string]: any
}

export type TContainerRef = string | TContainerObj

export type TImageObj = Image & {
  [key:string]: any
}

// TODO: Update this to whatever options end up being correct for spawning a new container
export type TRunOpts = {
  tag?: string
  name?: string
  user?: string
  provider?: string
  pidsLimit?: number
  container?: TContainerConfig
  hostConfig?: Record<any, any>
}

export type TRunResponse = {
  urls?: Record<string, string>
}

