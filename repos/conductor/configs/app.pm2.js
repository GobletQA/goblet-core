require('../resolveRoot')
const path = require('path')
const { aliases } = require('@GConfigs/aliases.config')

/** Path to the logs directory */
const logDir = aliases[`@GLogs`]
const cdRoot = aliases[`@GCDRoot`]

module.exports = {
  apps : [
    {
      cwd: cdRoot,
      watch: true,
      script: 'yarn',
      args: 'app:start',
      name: `App-Conductor`,
      interpreter: '/bin/bash',
      out_file: path.join(logDir, `conductor.out`),
      error_file: path.join(logDir, `conductor.err`),
    }
  ]
}