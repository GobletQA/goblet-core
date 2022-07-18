require('../resolveRoot')
const path = require('path')
const { aliases } = require('@GConfigs/aliases.config')

/** Path to the logs directory */
const logDir = aliases[`@GLogs`]
const tapRoot = aliases[`@GTapRoot`]

module.exports = {
  apps: [
    {
      cwd: tapRoot,
      args: 'start',
      script: 'yarn',
      name: `PM2.TAP`,
      interpreter: '/bin/bash',
      out_file: path.join(logDir, `tap.out`),
      error_file: path.join(logDir, `tap.err`),
    }
  ]
}