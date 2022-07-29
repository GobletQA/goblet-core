require('source-map-support').install({
  environment: 'node',
})

import { Conductor } from './index'
const secretHash = `c8da1644628fdfecf45bc26d79e242036ec65d3f34a6daf3981ae818da22cda0`


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
          19006,
          7005,
          7006,
          26369,
        ],
        // TODO: Load the envs from the values files, remove the hardcoded values
        envs: {
          KEG_DOCKER_EXEC: "conductor-run",
          API_PORT: "7005",
          DOC_APP_PATH: "/keg/tap",
          DOC_BUILD_PATH: "/keg/tap-build",
          FIRE_BASE_APP_ID: "1:870057104862:web:bdf798cb1c2b82f7f0b94f",
          FIRE_BASE_AUTH_DOMAIN: "herkin-dev.firebaseapp.com",
          FIRE_BASE_KEY: "AIzaSyD_8xb0hHynlTyWhDvqASpTmqM_qLxsjpA",
          FIRE_BASE_MEASURMENT_ID: "G-56KERW4600",
          FIRE_BASE_MESSAGING_SENDER_ID: "870057104862",
          FIRE_BASE_PROJECT_ID: "herkin-dev",
          FIRE_BASE_STORAGE_BUCKET: "herkin-dev.appspot.com",
          GOBLET_COOKIE_KEY: "k3G-H3rkiN",
          GOBLET_COOKIE_NAME: "goblet",
          GOBLET_MOUNT_ROOT: "/keg/repos",
          KEG_EXEC_CMD: "dev",
          KEG_PROXY_HOST: "local.keghub.io",
          KEG_PROXY_PORT: "19006",
          NODE_ENV: "local",
          DISPLAY: ":0.0",
          GITHUB_CLIENT_ID: "c9df47cc76f4c0e7e787",
          GOBLET_USE_VNC: "true",
          GOBLET_USE_AUTH: "true",
          NO_VNC_PORT: "26369",
          SCREENCAST_API_PORT: "7006",
          SCREENCAST_PROXY_HOST: "0.0.0.0",
          VNC_PROXY_HOST: "0.0.0.0",
          VNC_SERVER_PORT: "26370",
          VNC_VIEW_HEIGHT: "900",
          VNC_VIEW_WIDTH: "1440",
          PLAYWRIGHT_BROWSERS_PATH: "/ms-playwright",
          HOME: "/root",
          DEBUG: "pw:api*",
          LC_ALL: "C.UTF-8",
          LANG: "en_US.UTF-8",
          LANGUAGE: "en_US.UTF-8",
          DEBIAN_FRONTEND: "noninteractive",
          EXPO_CLI_VERSION: "5.3.2",
          PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD: "1",
          GITHUB_AUTH_USERS: "geoffrey.schultz@gmail.com,lancetipton04@gmail.com,nnorman15@gmail.com,lance.tipton@workboard.com,mpcarolin.dev@gmail.com",
        },
      }
    }
  }
})

conductor.start()
