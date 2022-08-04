require('./configs/aliases.config').registerAliases()
// TODO: figure out how to make this an alias instead of relative path
const { getGobletConfig } = require('./repos/shared/src/utils/getGobletConfig')
const config = getGobletConfig()
const { serviceAccount, ...firebaseConfig } = config.firebase
const {
  NODE_ENV,
  GB_AUTH_ACTIVE,
  GB_VNC_ACTIVE,
  GB_PW_SOCKET_ACTIVE,
  GB_GITHUB_CLIENT_ID,
  GB_GITHUB_AUTH_USERS,
  GB_VNC_VIEW_WIDTH=1440,
  GB_VNC_VIEW_HEIGHT=900,
} = process.env

module.exports = {
  alias: 'goblet',
  name: 'goblet',
  displayName: 'Goblet',
  keg: {
    envs: {
      'process.env.NODE_ENV': NODE_ENV,
      'process.env.GB_BE_HOST': config.server.host,
      'process.env.GB_AUTH_ACTIVE': GB_AUTH_ACTIVE,
      'process.env.GB_VNC_ACTIVE': GB_VNC_ACTIVE,
      'process.env.GB_PW_SOCKET_ACTIVE': GB_PW_SOCKET_ACTIVE,
      'process.env.GB_GITHUB_CLIENT_ID': GB_GITHUB_CLIENT_ID,
      'process.env.GB_GITHUB_AUTH_USERS': GB_GITHUB_AUTH_USERS,
      'process.env.GB_VNC_VIEW_WIDTH': `${GB_VNC_VIEW_WIDTH}`,
      'process.env.GB_VNC_VIEW_HEIGHT': `${GB_VNC_VIEW_HEIGHT}`,
      'process.env.GB_BE_PORT': `${config.server.port}`,
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
        tapSrc: './repos/tap/src',
      },
      aliases: {
        nameSpace: "HK",
        dynamic: {
          // Path is relative to <tap-root>/node_modules/keg-core/core/base
          // So we have to go-back 4 dirs to get back to tap-root, and find the admin repo
          GSHUtils: '../../../../repos/shared/src/utils/frontend',
          GSHModels: '../../../../repos/shared/src/models',
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
