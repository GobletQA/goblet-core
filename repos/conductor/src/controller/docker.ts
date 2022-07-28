import Dockerode from 'dockerode'
import { Controller } from './controller'
import type { Conductor } from '../conductor'
import { buildContainerEnvs } from '../utils/buildContainerEnvs'
import { buildContainerPorts } from '../utils/buildContainerPorts'
import { buildContainerLabels } from '../utils/buildContainerLabels'
import {
  TImgRef,
  TImgsConfig,
  TCreateOpts,
  TContainerRef,
  TDockerConfig,
  TCreateResponse,
  TContainerRoute,
} from '../conductor.types'

export class Docker extends Controller {

  docker: Dockerode
  images: TImgsConfig
  conductor: Conductor
  config: TDockerConfig

  constructor(conductor:Conductor, config:TDockerConfig){
    super(conductor, config)
    this.config = config
    this.docker = new Dockerode(config)
  }

  async create(imageRef:TImgRef, createOpts:TCreateOpts):Promise<TCreateResponse> {
    const image = this.getImg(imageRef)
    !image && this.notFoundErr({ type: `image`, ref: imageRef as string })

    const ports = await buildContainerPorts(image)

    const createConfig = {
      // TODO: investigate createContainer options that should be allowed form a request
      ...createOpts,
      PortBindings: ports,
      Env: buildContainerEnvs(image),
      Image: this.buildImgUri(image),
      Labels: buildContainerLabels(image),
      HostConfig: {
        // TODO: investigate this
        // IpcMode: 'none',
        // StorageOpt: { size: `10G`},
        // RestartPolicy: { name: `on-failure`, MaximumRetryCount: 2 },
        AutoRemove: true,
        PidsLimit: image?.pidsLimit || this?.config?.pidsLimit || 20,
      }
    }

    const container = await this.docker.createContainer(createConfig)

    !container
      && this.controllerErr({ message: `Docker could not create container from image ${image.name}` })

    this.containers[container.id] = container

    return {
      image,
      ports,
      container,
    }
  }

  getRouteFromRef = async (containerRef:TContainerRef):Promise<TContainerRoute> => {
    const container = this.getContainer(containerRef)
    !container && this.notFoundErr({ type: `container`, ref: containerRef as string })

    return undefined

  }

  getContainerRoute = async (containerRef:TContainerRef):Promise<TContainerRoute> => {
    const container = this.getContainer(containerRef)
    !container && this.notFoundErr({ type: `container`, ref: containerRef as string })

    return undefined
  }

}