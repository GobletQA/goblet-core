require('../resolveRoot')
const path = require('path')
const { aliases } = require('@GConfigs/aliases.config')

/** Path to the logs directory */
const logDir = aliases[`@GLogs`]
const scRoot = aliases[`@GSCRoot`]

module.exports = {
  apps : [
    {
      cwd: scRoot,
      script: 'yarn',
      name: `PM2.SC`,
      args: 'build:start',
      interpreter: '/bin/bash',
      watch: [`src`, `configs`],
      ignore_watch: [`dist`, `node_modules`],
      out_file: path.join(logDir, `screencast.out`),
      error_file: path.join(logDir, `screencast.err`),
    },
  ]
}