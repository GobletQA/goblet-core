require('source-map-support').install({environment: 'node'})

import { Conductor } from './index'
import { inDocker } from '@keg-hub/cli-utils'
import { loadEnvs } from '@gobletqa/shared/utils/loadEnvs'

const isDocker = inDocker()

const conductor = new Conductor({
  proxy: {
    secret: `c8da1644628fdfecf45bc26d79e242036ec65d3f34a6daf3981ae818da22cda0`
  },
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
          7005,
          7006,
          19006,
          26369,
        ],
        envs: {
          ...loadEnvs({
            name: `goblet`,
            locations: [],
            force: true,
            override: false
          }),
          KEG_DOCKER_EXEC: "conductor",
        },
        runtimeEnvs: {
          API_PORT: `ports.7005`,
          NO_VNC_PORT: `ports.26369`,
          KEG_PROXY_PORT: `ports.19006`,
          VNC_SERVER_PORT: `ports.26370`,
          SCREENCAST_API_PORT: `ports.7006`,
          VNC_PROXY_HOST: isDocker ? `0.0.0.0` : `host.docker.internal`,
          SCREENCAST_PROXY_HOST: isDocker ? `0.0.0.0` : `host.docker.internal`
          // TODO: this should be dynamically set to the auth users email
          // which is passed in at run time
          // GITHUB_AUTH_USERS: `user.email`,
        }
      }
    }
  }
})

conductor.start()
