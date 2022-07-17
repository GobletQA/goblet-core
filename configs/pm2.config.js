const fs = require('fs')
const path = require('path')
const { aliases } = require('./aliases.config')

/** Path to the logs directory */
const logDir = aliases[`@GLogs`]
/** Ensure the logs directory exists */
!fs.existsSync(logDir) && fs.mkdirSync(logDir)

const bkConfdir = aliases[`@GBK/Configs`]
const scConfdir = aliases[`@GSC/Configs`]
const vncPM2Conf = require(path.join(scConfdir, `vnc.pm2.js`))
const backPM2Conf = require(path.join(bkConfdir, `backend.pm2.js`))
const scPM2Conf = require(path.join(scConfdir, `screencast.pm2.js`))

module.exports = {
  apps : [
    ...scPM2Conf.apps,
    ...vncPM2Conf.apps,
    ...backPM2Conf.apps,
  ]
}
