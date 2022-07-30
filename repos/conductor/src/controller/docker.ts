import { ReadStream } from 'tty'
import Dockerode from 'dockerode'
import DockerEvents from 'docker-events'
import { Controller } from './controller'
import type { Conductor } from '../conductor'
import { buildImgUri } from '../utils/buildImgUri'
import { wait, noOp, isObj } from '@keg-hub/jsutils'
import { dockerEvents } from '../utils/dockerEvents'
import { generateUrls } from '../utils/generateUrls'
import { buildPullOpts } from '../utils/buildPullOpts'
import { CONDUCTOR_SUBDOMAIN_LABEL } from '../constants'
import { buildContainerEnvs } from '../utils/buildContainerEnvs'
import { buildContainerPorts } from '../utils/buildContainerPorts'
import { buildContainerLabels } from '../utils/buildContainerLabels'
import {
  TImgRef,
  TRunOpts,
  TUrlsMap,
  TPullOpts,
  TImgsConfig,
  TContainerRef,
  TDockerConfig,
  TContainerData,
  TContainerInfo,
  TContainerRoute,
  TContainerInspect
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

    // List for docker events, and cleanup our local cache
    this.events = dockerEvents(this.docker, {
      destroy: this.removeFromCache,
    })
  }

  removeFromCache = (message:Record<any,any>) => {
    this.containers = Object.entries(this.containers)
      .reduce((acc, [ref, container]:[string, TContainerData]) => {
        isObj(message)
          && message?.id !== container.Id
          && (acc[ref] = container)
        return acc
      }, {})
  }

  hydrate = async ():Promise<Record<string, TContainerInspect>> => {
    const containers = await this.getAll()
    this.containers = await containers.reduce(async (toResolve, container) => {
      const acc = await toResolve
      if(!container.Labels[CONDUCTOR_SUBDOMAIN_LABEL]) return acc

      if(container.State !== 'running'){
        this.docker.getContainer(container.Id).remove()
        return acc
      }

      acc[container.Id] = await this.docker.getContainer(container.Id).inspect()

      return acc
    }, Promise.resolve({}))
    

    return this.containers as Record<string, TContainerInspect>
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
      this.docker.listContainers({ all: true }, (err, containers) => {
        err ? rej(err) : res(containers)
      })
    })
  }

  run = async (imageRef:TImgRef, runOpts:TRunOpts, subdomain:string):Promise<TUrlsMap> => {
    const image = this.getImg(imageRef)
    !image && this.notFoundErr({ type: `image`, ref: imageRef as string })


    const { ports, exposed, bindings } = await buildContainerPorts(image)
    const pidLimit = image?.pidsLimit || this?.config?.pidsLimit

    const createConfig = {
      // TODO: investigate createContainer options that should be allowed form a request
      ...runOpts,
      ExposedPorts: exposed,
      Image: buildImgUri(image),
      Env: buildContainerEnvs(image),
      Labels: buildContainerLabels(image, subdomain),
      HostConfig: {
        ...runOpts.hostConfig,
        // AutoRemove: true,
        PortBindings: bindings,
        PidsLimit: pidLimit,
        // TODO: investigate this
        // IpcMode: 'none',
        // StorageOpt: { size: `10G`},
        RestartPolicy: { Name: `on-failure`, MaximumRetryCount: 2 },
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
    this.containers[container.id] = containerInfo

    return generateUrls(containerInfo, ports, subdomain, this?.conductor)
  }

  remove = async (containerRef:TContainerRef) => {
    const containerData = this.getContainer(containerRef)
    !containerData && this.notFoundErr({ type: `container`, ref: containerRef as string })

    const cont = await this.docker.getContainer(containerData.Id)
    await cont.stop()
    await cont.remove()

    this.containers = Object.entries(this.containers)
      .reduce((acc, [ref, cont]:[string, TContainerData]) => {
        cont.Id !== containerData.Id && (acc[ref] = cont)

        return acc
      }, {})

  }

  removeAll = async () => {
    const containers = await this.getAll()
    const removed = await Promise.all(
      containers.map(container => {
        if(container.Labels[CONDUCTOR_SUBDOMAIN_LABEL]){
          (async () => {
            const cont = this.docker.getContainer(container.Id)
            await cont.stop()
            await cont.remove()
          })()

          return container
        }
      })
    )

    return removed.filter(Boolean)
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