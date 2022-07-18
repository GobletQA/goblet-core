require('../resolveRoot')
const path = require('path')
const { aliases } = require('@GConfigs/aliases.config')

/** Path to the logs directory */
const logDir = aliases[`@GLogs`]
const scRoot = aliases[`@GSCRoot`]

module.exports = {
  apps : [
    {
      name: `TigerVnc`,
      out_file: path.join(logDir, `vnc.out`),
      error_file: path.join(logDir, `vnc.err`),
      script : path.join(scRoot, `./src/libs/vnc/vnc.js`),
    },
    {
      name: `WebSockify`,
      out_file: path.join(logDir, `sockify.out`),
      error_file: path.join(logDir, `sockify.err`),
      script : path.join(scRoot, `./src/libs/vnc/sockify.js`),
    }
  ]
}