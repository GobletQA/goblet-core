const fs = require('fs')
require('../resolveRoot')
const path = require('path')
const { aliases } = require('@GConfigs/aliases.config')

/** Path to the logs directory */
const logDir = aliases[`@GLogs`]

/** Ensure the logs directory exists */
!fs.existsSync(logDir) && fs.mkdirSync(logDir)

module.exports = {
  apps : [
    {
      name: `TigerVnc`,
      script : `./src/libs/vnc/vnc.js`,
      out_file: path.join(logDir, `vnc.out`),
      error_file: path.join(logDir, `vnc.err`),
    },
    {
      name: `WebSockify`,
      script : `./src/libs/vnc/sockify.js`,
      out_file: path.join(logDir, `sockify.out`),
      error_file: path.join(logDir, `sockify.err`),
    }
  ]
}