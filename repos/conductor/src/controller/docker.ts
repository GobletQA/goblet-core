import Dockerode from 'dockerode'
import { Controller } from './controller'
import type { Conductor } from '../conductor'
import { buildContainerPorts } from '../utils/buildContainerPorts'
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

    const container = await this.docker.createContainer({
      // TODO: investigate createContainer options that should be allowed form a request
      ...createOpts,
      PortBindings: ports,
      Image: this.buildImgUri(image),
      PidsLimit: image.pidsLimit || this.config.pidsLimit || 20,
    })

    !container
      && this.notFoundErr({ message: `Docker could not create container from image ${image.name}` })

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