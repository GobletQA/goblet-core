require('source-map-support').install({environment: 'node'})

import { Conductor } from './index'
import { omitKeys } from '@keg-hub/jsutils'
import { inDocker } from '@keg-hub/cli-utils'
import { loadEnvs } from '@gobletqa/shared/utils/loadEnvs'

const isDocker = inDocker()
const containerEnvs = omitKeys(loadEnvs({
  name: `goblet`,
  locations: [],
  force: true,
  override: false
}), [
  `BE_API_PORT`,
  `NO_VNC_PORT`,
  `KEG_PROXY_PORT`,
  `VNC_SERVER_PORT`,
  `SC_API_PORT`,
  `VNC_SERVER_HOST`,
  `BE_API_HOST`,
  `SC_API_HOST`,
])

const containerNodeEnv = containerEnvs.NODE_ENV || process.env.NODE_ENV
const containerHost = isDocker ? `host.docker.internal` : `0.0.0.0`

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
          ...containerEnvs,
          KEG_DOCKER_EXEC: `conductor`,
          // VNC_SERVER_HOST: containerHost,
          // BE_API_HOST: containerHost,
          // SC_API_HOST: containerHost
        },
        runtimeEnvs: {
          BE_API_HOST: `urls.7005`,
          BE_API_PORT: `ports.7005`,
          NO_VNC_PORT: `ports.26369`,
          KEG_PROXY_PORT: `ports.19006`,
          VNC_SERVER_HOST: `urls.26370`,
          VNC_SERVER_PORT: `ports.26370`,
          SC_API_HOST: `urls.7006`,
          SC_API_PORT: `ports.7006`,
          // TODO: this should be dynamically set to the auth users email
          // which is passed in at run time
          // GITHUB_AUTH_USERS: `user.email`,
        }
      }
    }
  }
})

conductor.start()
