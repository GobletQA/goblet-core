require('../resolveRoot')
const path = require('path')
const { aliases } = require('@GConfigs/aliases.config')

/** Path to the logs directory */
const logDir = aliases[`@GLogs`]
const bkRoot = aliases[`@GBKRoot`]

module.exports = {
  apps : [
    {
      cwd: bkRoot,
      watch: true,
      script: 'yarn',
      name: `Backend`,
      args: 'build:start',
      interpreter: '/bin/bash',
      out_file: path.join(logDir, `backend.out`),
      error_file: path.join(logDir, `backend.err`),
    }
  ]
}