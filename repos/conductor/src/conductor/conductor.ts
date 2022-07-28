import { Request } from 'express'
import { createProxy } from '../proxy'
import { createServer } from '../server'
import { wait } from '@keg-hub/jsutils'
import { TConductorOpts } from '../options.types'
import { buildConfig } from '../utils/buildConfig'
import { Controller } from '../controller/controller'
import { resolveHostName } from '../utils/resolveHostName'
import { getController } from '../controller/controllerTypes'
import { TConductorConfig, TContainerRef } from '../conductor.types'

export class Conductor {

  config: TConductorConfig
  controller: Controller
  rateLimitMap:Record<any, any>
  containerTimeoutMap: Record<any, any>

  constructor(config:TConductorOpts) {
    this.rateLimitMap = {}
    this.containerTimeoutMap = {}
    this.config = buildConfig(config)
    this.controller = getController(this.config.controller)

    config.images
      && this.controller.buildImgs(this.config.images)
  }

  /**
   * Ensures the passed in config is valid
   */
  static validateConfig(config:TConductorConfig) {
    if (!config) {
      throw new Error('Required parameter config not provided')
    }
    const requiredProperties = ['image', 'port', 'containerPort']

    for (const prop of requiredProperties) {
      if (!(prop in config)) throw new Error(`Required property ${prop} not found in config`)
    }
  }

  /**
   * Ensures a single IP doesn't make to many requests
   */
  async handleRateLimit(client) {
    if (this.config.proxy.rateLimit <= 0) return

    const addr = client.remoteAddress
    const now = new Date().getTime()
    let nextTime = now + this.config.proxy.rateLimit

    if (addr in this.rateLimitMap) {
      const lastTime = this.rateLimitMap[addr]
      const waitTime = lastTime - now
      if (waitTime > 0) {
        nextTime += waitTime
        await wait(waitTime)
      }
    }

    this.rateLimitMap[addr] = nextTime
  }

  /**
   * Spawns a new container based on the passed in request
   * Is called from the spawn endpoint
   */
  async spawnContainer(req:Request) {
    const { key, ...createOpts } = req?.body
    if(!key && !createOpts.name)
      throw new Error(`Image ref or name is require to spawn a new container`)
    
    const {container, ports, image } = await this.controller.create(key, createOpts)
    await container.start()

    // Wait slightly longer for container to start.
    // Hack because sometimes the connection gets randomly reset.
    await wait(200)

    return {
      ports,
      image,
      container,
    }
  }

  async cleanupContainer(containerRef:TContainerRef) {
    await this.controller.remove(containerRef)
  }

  async proxyRouter(req:Request) {
    const destination = resolveHostName(req)

    const route = await this.controller.getContainerRoute(destination)
    if(!route) throw new Error(`Unrecognized route for destination ${destination}`)

    return {
      port: route.port,
      host: route.host,
      protocol: route.port === 443 ? `https:` : `http:`,
    }
  }

  async start() {
    createServer(this.config.server)
    
    createProxy({ ...this.config.proxy, proxyRouter: this.proxyRouter.bind(this) })
    return this
  }

}


