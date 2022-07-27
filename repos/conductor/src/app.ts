import { Conductor } from './index'

const conductor = new Conductor({
  images: {
    goblet: {
      tag: `develop`,
      provider: `ghcr.io`,
      name: `gobletqa/goblet`,
      container: {
        mem: 0,
        idle: 5000,
        timeout: 5000,
        rateLimit: 5000,
        ports: [
          443,
          19006,
          7005,
          7006,
          26369,
          26370
        ],
      }
    }
  }
})

conductor.start()
