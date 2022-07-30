
import { omitKeys } from '@keg-hub/jsutils'
import { TConductorOpts } from '@gobletqa/conductor/types'
import { loadEnvs } from '@gobletqa/shared/utils/loadEnvs'

const containerEnvs = omitKeys(loadEnvs({
  name: `goblet`,
  locations: [],
  force: true,
  override: false
}), [
  `GB_BE_API_PORT`,
  `GB_NO_VNC_PORT`,
  `KEG_PROXY_PORT`,
  `GB_VNC_SERVER_PORT`,
  `GB_SC_API_PORT`,
  `GB_VNC_SERVER_HOST`,
  `GB_BE_API_HOST`,
  `GB_SC_API_HOST`,
])

export const appConfig:TConductorOpts = {
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
        },
        runtimeEnvs: {
          GB_BE_API_HOST: `urls.7005`,
          GB_BE_API_PORT: `ports.7005`,
          GB_NO_VNC_PORT: `ports.26369`,
          KEG_PROXY_PORT: `ports.19006`,
          GB_VNC_SERVER_HOST: `urls.26370`,
          GB_VNC_SERVER_PORT: `ports.26370`,
          GB_SC_API_HOST: `urls.7006`,
          GB_SC_API_PORT: `ports.7006`,
          // TODO: this should be dynamically set to the auth users email
          // which is passed in at run time
          // GB_GITHUB_AUTH_USERS: `user.email`,
        }
      }
    }
  }
}
