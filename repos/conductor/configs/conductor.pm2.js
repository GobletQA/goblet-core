require('../resolveRoot')
const path = require('path')
const { aliases } = require('@GConfigs/aliases.config')

/** Path to the logs directory */
const logDir = aliases[`@GLogs`]
const cdRoot = aliases[`@gobletqa/conductor/root`]

module.exports = {
  apps : [
    {
      cwd: cdRoot,
      watch: true,
      script: 'yarn',
      name: `Conductor`,
      args: 'build:start',
      interpreter: '/bin/bash',
      out_file: path.join(logDir, `conductor.out`),
      error_file: path.join(logDir, `conductor.err`),
    }
  ]
}