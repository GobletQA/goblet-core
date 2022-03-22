require('./configs/aliases.config').registerAliases()
const package = require('./package.json')

const { getHerkinConfig } = require('./repos/shared/utils/getHerkinConfig')
const config = getHerkinConfig()
const { process: proc, ...webSockConf } = config.server
const { serviceAccount, ...firebaseConfig } = config.firebase
const {
  NODE_ENV,
  HERKIN_USE_AUTH,
  HERKIN_USE_VNC,
  NO_VNC_PORT=26369,
  HERKIN_PW_SOCKET,
  GITHUB_CLIENT_ID,
  GITHUB_AUTH_USERS,
  VNC_VIEW_WIDTH=1440,
  VNC_VIEW_HEIGHT=900,
} = process.env

module.exports = {
  alias: 'herkin',
  name: 'keg-herkin',
  displayName: 'Keg-Herkin',
  keg: {
    envs: {
      'process.env.NODE_ENV': NODE_ENV,
      'process.env.HERKIN_USE_AUTH': HERKIN_USE_AUTH,
      'process.env.HERKIN_USE_VNC': HERKIN_USE_VNC,
      'process.env.NO_VNC_PORT': `${NO_VNC_PORT}`,
      'process.env.HERKIN_PW_SOCKET': HERKIN_PW_SOCKET,
      'process.env.GITHUB_CLIENT_ID': GITHUB_CLIENT_ID,
      'process.env.GITHUB_AUTH_USERS': GITHUB_AUTH_USERS,
      'process.env.VNC_VIEW_WIDTH': `${VNC_VIEW_WIDTH}`,
      'process.env.VNC_VIEW_HEIGHT': `${VNC_VIEW_HEIGHT}`,
      'process.env.SERVER_HOST': config.server.host,
      'process.env.SERVER_PORT': `${config.server.port}`,
      'process.env.SCREENCAST_HOST': config.screencast.server.host,
      'process.env.SCREENCAST_PORT': `${config.screencast.server.port}`,
      'process.env.WS_SERVER_CONFIG': JSON.stringify(webSockConf),
      ...(firebaseConfig.ui && {
        'process.env.FIRE_BASE_CONFIG': JSON.stringify(firebaseConfig),
      }),
    },
    cli: {
      publish: {
        herkin: {
          tasks: {
            install: true,
            test: true,
            build: true,
            publish: true,
            commit: true,
          },
          tap: true,
          name: 'herkin',
          dependent: false,
          order: {
            0: '@keg-hub/keg-herkin',
          },
        },
      },
      paths: {
        container: `./container`,
        repos: `./repos`,
      }
    },
    routes: {
      '/': 'RootContainer',
      '/editor': 'EditorScreen',
      '/screencast': 'ScreencastScreen',
      '/results': 'ResultsScreen',
    },
    tapResolver: {
      paths: {
        tapSrc: './repos/tap',
      },
      aliases: {
        nameSpace: "HK",
        dynamic: {
          // Path is relative to <tap-root>/node_modules/keg-core/core/base
          // So we have to go-back 4 dirs to get back to tap-root, and find the admin repo
          AdminActions: '../../../../repos/admin/src/actions',
          AdminServices: '../../../../repos/admin/src/services',
          AdminComponents: '../../../../repos/admin/src/components',
        },
      },
    },
  },
  expo: {
    name: 'keg-herkin',
    slug: 'keg-herkin',
    platforms: ['web'],
  },
}
