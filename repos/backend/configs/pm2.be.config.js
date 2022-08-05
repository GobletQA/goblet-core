require('../resolveRoot')
const path = require('path')
const { aliases } = require('@GConfigs/aliases.config')

/** Path to the logs directory */
const logDir = aliases[`@GLogs`]
const bkRoot = aliases[`@GBKRoot`]


module.exports = {
  apps: [
    {
      cwd: bkRoot,
      script: 'yarn',
      name: `PM2.BE`,
      args: 'serve',
      interpreter: '/bin/bash',
      watch: [
        `src`,
        `configs`,
        `../shared`,
        `../workflows`,
      ],
      ignore_watch: [`dist`, `node_modules`],
      out_file: path.join(logDir, `backend.out`),
      error_file: path.join(logDir, `backend.err`),
    }
  ]
}
