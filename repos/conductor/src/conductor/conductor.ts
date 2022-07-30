import { createProxy } from '../proxy'
import { wait } from '@keg-hub/jsutils'
import { createServer } from '../server'
import { Request, Express } from 'express'
import { getApp } from '@gobletqa/shared/app'
import { getDomain } from '../utils/getDomain'
import { buildConfig } from '../utils/buildConfig'
import { Controller } from '../controller/controller'
import { getController } from '../controller/controllerTypes'
import { hydrateRoutes } from '../utils/hydrateRoutes'
import {
  TImgRef,
  TUrlMap,
  TSpawnOpts,
  TProxyRoute,
  TContainerRef,
  TConductorOpts,
  TConductorConfig,
} from '../types'

export class Conductor {

  domain: string
  controller: Controller
  config: TConductorConfig
  rateLimitMap:Record<any, any>
  containerTimeoutMap: Record<any, any>
  routes: Record<string, Record<string, TUrlMap>> = {}

  constructor(config:TConductorOpts) {
    this.rateLimitMap = {}
    this.containerTimeoutMap = {}
    this.config = buildConfig(config)
    this.domain = getDomain(this.config)
    this.controller = getController(this, this.config.controller)

    config.images
      && this.controller.buildImgs(this.config.images)
    
    const app = getApp() as Express
    app.locals.conductor = this as Conductor
    this.controller.hydrate().then((containers) => hydrateRoutes(this, containers))
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
   * Pulls an image by forwarding it to the controller.pull method
   */
  async pull(imageRef:TImgRef){
    await this.controller.pull(imageRef)
  } 

  /**
   * Spawns a new container based on the passed in request
   * Is called from the spawn endpoint
   */
  async spawn(imageRef:TImgRef, spawnOpts:TSpawnOpts, subdomain:string) {
    if(!imageRef && !spawnOpts.name)
      throw new Error(`Image ref or name is require to spawn a new container`)
    
    const { urls, map } = await this.controller.run(imageRef, spawnOpts, subdomain)
    this.routes[subdomain] = map
  
    return { urls }
  }

  /**
   * Removes a container be reference name
   */
  async remove(containerRef:TContainerRef){
    return await this.controller.remove(containerRef)
  } 

  /**
   * Removes all existing conductor containers
   * Then calls cleanup method of existing controller
   */
  async cleanup() {
    await this.controller.removeAll()
    return await this.controller.cleanup()
  }

  async proxyRouter(req:Request):Promise<TProxyRoute|string> {
    const [port, subdomain] = (req.subdomains || []).reverse()
    const routeData = this.routes?.[subdomain]?.[port]
    
    return routeData?.internal
      || routeData?.route
      || undefined

    // if(!route) throw new Error(`Unrecognized route for destination ${destination}`)

    // return {
    //   port: route.port,
    //   host: route.host,
    //   protocol: route.port === 443 ? `https:` : `http:`,
    // } as TProxyRoute
  }

  /**
   * Starts conductor by creating the Server and Proxy
   */
  async start() {
    createServer(this.config.server)
    createProxy({ ...this.config.proxy, proxyRouter: this.proxyRouter.bind(this) })

    return this
  }

}


