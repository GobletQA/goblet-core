const net = require('net')
const delay = require('delay')
const Docker = require('dockerode')
const getPort = require('get-port')
const Logger = require('@keg-hub/cli-utils')

class Conductor {
  constructor(config) {
    Conductor.validateConfig(config)
    this.config = config
    // ip -> time
    this.rateLimitMap = {}
    // container => timeout id
    this.containerTimeoutMap = {}
    this.docker = new Docker({ socketPath: '/var/run/docker.sock' })
  }

  static validateConfig(config) {
    if (!config) {
      throw new Error('Required parameter config not provided')
    }
    const requiredProperties = ['image', 'port', 'containerPort']
    for (const prop of requiredProperties) {
      if (!(prop in config)) throw new Error(`Required property ${prop} not found in config`)
    }
  }

  async _handleRateLimit(client) {
    if (this.config.rateLimit <= 0) return

    const addr = client.remoteAddress
    const now = new Date().getTime()
    let nextTime = now + this.config.rateLimit

    if (addr in this.rateLimitMap) {
      const lastTime = this.rateLimitMap[addr]
      const waitTime = lastTime - now
      if (waitTime > 0) {
        nextTime += waitTime
        await delay(waitTime)
      }
    }

    this.rateLimitMap[addr] = nextTime
  }

  async _setupContainer() {
    const avaliablePort = await getPort({ host: '127.0.0.1' })
    const pidsLimit = this.config.pidsLimit ? this.config.pidsLimit : 20
    const container = await this.docker.createContainer({
      Image: this.config.image,
      PidsLimit: pidsLimit,
      PortBindings: {
        [this.config.containerPort]: [
          {
            HostIP: '127.0.0.1',
            HostPort: avaliablePort.toString(),
          },
        ],
      },
    })

    await container.start()

    // wait slightly longer for container to start. Otherwise connection may randomly get reset.
    await delay(200)

    return { container, avaliablePort }
  }

  _doTcpProxy(client, port) {
    return new Promise((resolve) => {
      client.on('error', resolve)
      client.on('close', resolve)

      const service = new net.Socket()

      service.connect(port, '127.0.0.1', () => {
        client.pipe(service)
        service.pipe(client)
      })

      service.on('error', resolve)
      service.on('close', resolve)

      if (this.config.timeout) {
        setTimeout(resolve, this.config.timeout)
      }
    })
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
    const { container, avaliablePort } = await this._setupContainer(client)

    const id = container.id.substring(0, 12)
    Logger.info(`container ${client.remoteAddress}/${id} created`)

    await this._doTcpProxy(client, avaliablePort)
    Logger.info(`session ${client.remoteAddress}/${id} ending`)
    await Conductor._cleanupContainer(container)
  }

  start() {
    return new Promise((resolve) => {
      this.server = net.createServer(this._clientHandler.bind(this))
      const host = '0.0.0.0'
      this.server.on('listening', () => {
        Logger.info(`listening on ${host}:${this.config.port}`)
        resolve()
      })
      this.server.listen(this.config.port, host)
    })
  }

  stop() {
    return new Promise((resolve) => {
      this.server.close(() => {
        Logger.info('server shutting down')
        resolve()
      })
    })
  }
}

module.exports = Conductor
