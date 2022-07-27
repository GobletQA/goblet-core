import * as Conductor from './index'

const config = {
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
}


console.log(Conductor)

// const conductor = new Conductor(config)

// console.log(conductor)
