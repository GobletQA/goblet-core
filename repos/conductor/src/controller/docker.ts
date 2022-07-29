import { ReadStream } from 'tty'
import Dockerode from 'dockerode'
import DockerEvents from 'docker-events'
import { Controller } from './controller'
import type { Conductor } from '../conductor'
import { wait, noOp } from '@keg-hub/jsutils'
import { CONDUCTOR_LABEL } from '../constants'
import { buildImgUri } from '../utils/buildImgUri'
import { dockerEvents } from '../utils/dockerEvents'
import { generateUrls } from '../utils/generateUrls'
import { buildPullOpts } from '../utils/buildPullOpts'
import { buildContainerEnvs } from '../utils/buildContainerEnvs'
import { buildContainerPorts } from '../utils/buildContainerPorts'
import { buildContainerLabels } from '../utils/buildContainerLabels'
import {
  TImgRef,
  TRunOpts,
  TPullOpts,
  TImgsConfig,
  TRunResponse,
  TContainerObj,
  TContainerRef,
  TDockerConfig,
  TContainerInfo,
  TContainerRoute,
} from '../types'

export class Docker extends Controller {

  domain: string
  docker: Dockerode
  images: TImgsConfig
  conductor: Conductor
  config: TDockerConfig
  events: DockerEvents

  constructor(conductor:Conductor, config:TDockerConfig){
    super(conductor, config)
    this.config = config
    this.docker = new Dockerode(config?.options)
    this.events = dockerEvents(this.docker)

  }

  pull = async (imageRef:TImgRef, pullOpts:TPullOpts):Promise<void> => {
    const image = this.getImg(imageRef)
    !image && this.notFoundErr({ type: `image`, ref: imageRef as string })

    const repoTag = buildImgUri(image)
    const options = buildPullOpts(image, pullOpts)

    return new Promise((res, rej) => {
      this.docker.pull(repoTag, options, (err:Error, stream:ReadStream) => {
        if(err) return rej(err)
        this.docker.modem.followProgress(
          stream,
          err => err ? rej(err) : res(),
          noOp
        )
      })
    })
  }

  getAll = async ():Promise<TContainerInfo[]> => {
    return new Promise((res, rej) => {
      this.docker.listContainers((err, containers) => {
        err ? rej(err) : res(containers)
      })
    })
  }

  run = async (imageRef:TImgRef, runOpts:TRunOpts, subdomain:string):Promise<TRunResponse> => {
    const image = this.getImg(imageRef)
    !image && this.notFoundErr({ type: `image`, ref: imageRef as string })


    const { ports, exposed, bindings } = await buildContainerPorts(image)
    const createConfig = {
      // TODO: investigate createContainer options that should be allowed form a request
      ...runOpts,
      ExposedPorts: exposed,
      Env: buildContainerEnvs(image),
      Image: buildImgUri(image),
      Labels: buildContainerLabels(image),
      HostConfig: {
        ...runOpts.hostConfig,
        AutoRemove: true,
        PortBindings: bindings,
        PidsLimit: image?.pidsLimit || this?.config?.pidsLimit || 20,
        // TODO: investigate this
        // IpcMode: 'none',
        // StorageOpt: { size: `10G`},
        // RestartPolicy: { name: `on-failure`, MaximumRetryCount: 2 },
      }
    }

    const container = await this.docker.createContainer(createConfig)

    !container
      && this.controllerErr({ message: `Docker could not create container from image ${image.name}` })

    await container.start()
    // Wait slightly longer for container to start.
    // Hack because sometimes the connection gets randomly reset.
    await wait(200)

    const containerInfo = await container.inspect()
    const { urls, map } = generateUrls(containerInfo, ports, subdomain, this?.conductor)

    this.containers[container.id] = container

    return {
      urls,
    }
  }

  remove = async (containerRef:TContainerRef) => {
    const container = this.getContainer(containerRef)
    !container && this.notFoundErr({ type: `container`, ref: containerRef as string })

    await container.stop()
    await container.remove()

    this.containers = Object.entries(this.containers)
      .reduce((acc, [ref, cont]:[string, TContainerObj]) => {
        cont.id !== container.id && (acc[ref] = cont)

        return acc
      }, {})

  }

  removeAll = async () => {
    const containers = await this.getAll()
    return containers.map(container => {
      container.Labels[`${CONDUCTOR_LABEL}.conductor`]
        && this.docker.getContainer(container.Id).stop()

      return container
    })
  }

  cleanup = async () => {
    return new Promise(async (res, rej) => {
      try {
        // TODO: figure out if these take a callback
        await this.docker.pruneContainers()
        await this.docker.pruneImages()
        await this.docker.pruneVolumes()
        res(true)
      }
      catch(err){
        rej(err)
      }
    })
  }

  route = async (containerRef:TContainerRef):Promise<TContainerRoute> => {
    const container = this.getContainer(containerRef)
    !container && this.notFoundErr({ type: `container`, ref: containerRef as string })

    return undefined
  }

}