import { Docker } from './docker'
import { Proxy } from './proxy'
import { Logger, wait } from '@keg-hub/cli-utils'
import { TConductorConfig } from './conductor.types'

export class Conductor {

  proxy: Proxy
  docker: Docker
  config: TConductorConfig

  rateLimitMap:Record<any, any>
  containerTimeoutMap: Record<any, any>

  constructor(config:TConductorConfig) {

    this.config = config

    // ip -> time
    this.rateLimitMap = {}

    // container => timeout id
    this.containerTimeoutMap = {}

    this.proxy = new Proxy(this, config.proxy)
    this.docker = new Docker(this, config.docker)

    config.images && this.docker.buildImgs(config.images)
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

  async _handleRateLimit(client) {
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

  async spawnContainer(client:Conductor, request) {
    const { key, ...img } = request?.body
    if(!key && !img.name)
      throw new Error(`Image ref or name is require to spawn a new container`)
    
    const {container, ports, image } = await this.docker.create(key, img)
    await container.start()

    // Wait slightly longer for container to start.
    // Hack because sometimes the connection gets randomly reset.
    await wait(200)

    return { image, container, ports }
  }


  static async _cleanupContainer(container) {
    await container.stop()
    await container.remove()
  }

  async _clientHandler(client) {
    // ignore errors so logic not interrupted
    client.on('error', () => {})

    if (!client.remoteAddress) {
      Logger.warn('client immediately disconnected')
      return
    }

    Logger.info(`new connection from ${client.remoteAddress}`)

    await this._handleRateLimit(client)
    if (client.destroyed) {
      Logger.warn(`client ${client.remoteAddress} disconnected before container created`)
      return
    }
    
    // TODO figure out to pass in the client request instead of {}
    const { container, ports } = await this.spawnContainer(client, {})

    const id = container.id.substring(0, 12)
    Logger.info(`container ${client.remoteAddress}/${id} created`)

    // TODO: investigate this to see why it waiting
    await this.proxy.create(client, ports)

    Logger.info(`session ${client.remoteAddress}/${id} ending`)
    await Conductor._cleanupContainer(container)
  }

  start() {
    return this.proxy.start()
  }

  stop() {
    return this.proxy.stop()
  }
}

module.exports = Conductor
