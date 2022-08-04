import { ReadStream } from 'tty'
import Dockerode from 'dockerode'
import DockerEvents from 'docker-events'
import { Controller } from './controller'
import type { Conductor } from '../conductor'
import { noOp, isObj } from '@keg-hub/jsutils'
import { buildImgUri } from '../utils/buildImgUri'
import { dockerEvents } from '../utils/dockerEvents'
import { buildPullOpts } from '../utils/buildPullOpts'
import { CONDUCTOR_SUBDOMAIN_LABEL } from '../constants'
import { Logger } from '@gobletqa/conductor/utils/logger'
import { buildContainerPorts } from '../utils/buildContainerPorts'
import { buildContainerConfig } from '../utils/buildContainerConfig'
import { generateUrls, generateExternalUrls } from '../utils/generateUrls'

import {
  TImgRef,
  TRunOpts,
  TPullOpts,
  TImgsConfig,
  TRunResponse,
  TContainerRef,
  TDockerConfig,
  TContainerData,
  TContainerInfo,
  TContainerInspect
} from '../types'

import { createContainer, startContainer } from '../utils/runContainerHelpers'

/**
 * Docker controller class with interfacing with the Docker-Api via Dockerode
 * Matches the Controller class interface
 */
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

  /**
   * Gets all running containers and rebuilds the runtime cache and routes
   * Allows starting / restarting conductor at anytime and it still works
   * @member Docker
   */
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

    const hydrateCount = Object.keys(this.containers).length
    hydrateCount && Logger.info(`Hydrating ${hydrateCount} container(s) into runtime cache`)

    return this.containers as Record<string, TContainerInspect>
  }

  /**
   * Pulls a docker image locally so it can be run
   * @member Docker
   */
  pull = async (imageRef:TImgRef, pullOpts:TPullOpts):Promise<void> => {
    const image = this.getImg(imageRef)
    !image && this.notFoundErr({ type: `image`, ref: imageRef as string })

    const repoTag = buildImgUri(image)
    const options = buildPullOpts(image, pullOpts)

    Logger.info(`Pulling image ${repoTag}...`)

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

  /**
   * Gets all containers from the Docker-Api
   * @member Docker
   */
  getAll = async ():Promise<TContainerInfo[]> => {
    return new Promise((res, rej) => {
      this.docker.listContainers({ all: true }, (err, containers) => {
        err ? rej(err) : res(containers.map(container => ({ ...container, Name: container.Names[0] })))
      })
    })
  }

  /**
   * Removes a container from the runtime cache based on Id
   * @member Docker
   */
  removeFromCache = (message:Record<any,any>) => {
    Logger.info(`Removing container ${message?.Actor?.Attributes?.name} from cache`)

    this.containers = Object.entries(this.containers)
      .reduce((acc, [ref, container]:[string, TContainerData]) => {
        isObj(message)
          && message?.id !== container.Id
          && (acc[ref] = container)
        return acc
      }, {})
  }

  /**
   * Removes a container from docker, by calling the Docker API
   */
  remove = async (containerRef:TContainerRef) => {
    const containerData = this.getContainer(containerRef)
    !containerData && this.notFoundErr({ type: `container`, ref: containerRef as string })

    const cont = await this.docker.getContainer(containerData.Id)

    Logger.info(`Removing container with ID ${cont.id}`)

    // Called inside an iif to it doesn't holdup the response 
    // Basically fire and forget
    ;(async () => {
      await cont.stop()
      await cont.remove()
    })()

    this.containers = Object.entries(this.containers)
      .reduce((acc, [ref, cont]:[string, TContainerData]) => {
        cont.Id !== containerData.Id && (acc[ref] = cont)

        return acc
      }, {})

    Logger.success(`Container removed successfully`)
    return cont
  }

  /**
   * Removes all containers with the conductor label
   * @member Docker
   */
  removeAll = async () => {
    const containers = await this.getAll()
    const removed = await Promise.all(
      containers.map(container => {
        if(container.Labels[CONDUCTOR_SUBDOMAIN_LABEL]){
          try {
            ;(async () => {
              const cont = this.docker.getContainer(container.Id)
              await cont.stop()
              await cont.remove()
            })()
          }
          catch(err){}

          return container
        }
      })
    )

    return removed.filter(Boolean)
  }

  /**
   * Calls Docker Prune api on containers, images, and volumes
   * @member Docker
   */
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

  /**
   * Similar to the docker run command from the docker cli
   * Will first create a container from the passed in imageRef
   * Then starts it, calling passed in hooks as needed 
   * Returns a set of urls for connecting to the running container
   * Generates a url for each exposed port
   * @member Docker
   */
  run = async (
    imageRef:TImgRef,
    runOpts:TRunOpts,
    subdomain:string
  ):Promise<TRunResponse> => {
    const image = this.getImg(imageRef)
    !image && this.notFoundErr({ type: `image`, ref: imageRef as string })

    // Build the container ports and container create config 
    const portData = await buildContainerPorts(image)
    const urls = generateExternalUrls(portData.ports, subdomain, this.conductor)
    
    const containerConfig = await buildContainerConfig(
      this,
      image,
      subdomain,
      runOpts,
      portData,
      urls
    )

    // Create the container from the image
    const container = await createContainer(this, image, containerConfig)

    // Start the container that was just created
    const containerInspect = await startContainer(image, container)

    // Cache the container in runtime cache
    this.containers[container.id] = containerInspect

    // Generate the urls for accessing the container
    Logger.info(`Generating container urls...`)
    const { meta, map } = generateUrls(
      containerInspect,
      portData.ports,
      this.conductor
    )

    return {
      map,
      urls,
      meta,
    }

  }

}