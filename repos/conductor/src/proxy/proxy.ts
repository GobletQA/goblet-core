import net from 'net'
import { Logger } from '@keg-hub/cli-utils'
import type { Conductor } from '../conductor'
import { TProxyConfig } from '../conductor.types'
import { DEF_HOST_IP } from '../constants/constants'

export class Proxy {

  server: net.Server
  config:TProxyConfig
  conductor:Conductor

  constructor(conductor:Conductor, config:TProxyConfig){
    this.config = config
    this.conductor = conductor
  }

  start() {
    return new Promise((res, rej) => {
      this.server = net.createServer(this.conductor._clientHandler.bind(this))

      this.server.on('listening', () => {
        Logger.info(`listening on ${this.config.host}:${this.config.port}`)
        res()
      })

      this.server.listen(this.config.port, this.config.host)
  
    }) as Promise<void>
  }

  stop() {
    return new Promise((res, rej) => {
      this.server.close(() => {
        Logger.info('Proxy server shutting down...')
        res()
      })
    }) as Promise<void>
  }

  create(client, ports) {
    return new Promise((res) => {
      client.on('error', res)
      client.on('close', res)

      const service = new net.Socket()

      // TODO: need to loop ports and create proxy for each port
      const port = ports[0]

      service.connect(port, DEF_HOST_IP, () => {
        client.pipe(service)
        service.pipe(client)
      })

      service.on('error', res)
      service.on('close', res)

      if (this.config.timeout) {
        setTimeout(res, this.config.timeout)
      }
    })
  }

} 