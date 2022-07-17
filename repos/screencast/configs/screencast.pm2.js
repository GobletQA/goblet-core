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
      watch: true,
      script: 'yarn',
      name: `Screencast`,
      args: 'build:start',
      interpreter: '/bin/bash',
      out_file: path.join(logDir, `screencast.out`),
      error_file: path.join(logDir, `screencast.err`),
    },
  ]
}