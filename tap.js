require('./configs/aliases.config').registerAliases()
const { getGobletConfig } = require('./repos/shared/utils/getGobletConfig')
const config = getGobletConfig()
const { serviceAccount, ...firebaseConfig } = config.firebase
const {
  NODE_ENV,
  GOBLET_USE_AUTH,
  GOBLET_USE_VNC,
  GOBLET_PW_SOCKET,
  GITHUB_CLIENT_ID,
  GITHUB_AUTH_USERS,
  VNC_VIEW_WIDTH=1440,
  VNC_VIEW_HEIGHT=900,
} = process.env

module.exports = {
  alias: 'goblet',
  name: 'goblet',
  displayName: 'Goblet',
  keg: {
    envs: {
      'process.env.NODE_ENV': NODE_ENV,
      'process.env.GOBLET_USE_AUTH': GOBLET_USE_AUTH,
      'process.env.GOBLET_USE_VNC': GOBLET_USE_VNC,
      'process.env.GOBLET_PW_SOCKET': GOBLET_PW_SOCKET,
      'process.env.GITHUB_CLIENT_ID': GITHUB_CLIENT_ID,
      'process.env.GITHUB_AUTH_USERS': GITHUB_AUTH_USERS,
      'process.env.VNC_VIEW_WIDTH': `${VNC_VIEW_WIDTH}`,
      'process.env.VNC_VIEW_HEIGHT': `${VNC_VIEW_HEIGHT}`,
      'process.env.GOBLET_SERVER_HOST': config.server.host,
      'process.env.SERVER_PORT': `${config.server.port}`,
      'process.env.WS_SERVER_CONFIG': JSON.stringify(config.server.sockr),
      ...(firebaseConfig.ui && {
        'process.env.FIRE_BASE_CONFIG': JSON.stringify(firebaseConfig),
      }),
    },
    cli: {
      publish: {
        goblet: {
          tasks: {
            install: true,
            test: true,
            build: true,
            publish: true,
            commit: true,
          },
          tap: true,
          name: 'goblet',
          dependent: false,
          order: {
            0: '@gobletqa/goblet',
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
    name: 'goblet',
    slug: 'goblet',
    platforms: ['web'],
  },
}
