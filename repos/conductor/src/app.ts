require('source-map-support').install({
  environment: 'node',
})

import { Conductor } from './index'

const conductor = new Conductor({
  controller: {
    type: 'Docker'
  },
  images: {
    goblet: {
      tag: `develop`,
      name: `goblet`,
      user: `gobletqa`,
      provider: `ghcr.io`,
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
