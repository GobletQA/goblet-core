const fs = require('fs')
const path = require('path')
const { aliases } = require('./aliases.config')

/** Path to the logs directory */
const logDir = aliases[`@GLogs`]
/** Ensure the logs directory exists */
!fs.existsSync(logDir) && fs.mkdirSync(logDir)

const bkConfdir = aliases[`@GBK/Configs`]
const scConfdir = aliases[`@GSC/Configs`]
const tapConfdir = aliases[`@GTapRoot/Configs`]
const scPM2Conf = require(path.join(scConfdir, `pm2.sc.config.js`))
const vncPM2Conf = require(path.join(scConfdir, `pm2.vnc.config.js`))
const backPM2Conf = require(path.join(bkConfdir, `pm2.be.config.js`))
const tapPM2Conf = require(path.join(tapConfdir, `pm2.tap.config.js`))

module.exports = {
  apps : [
    ...scPM2Conf.apps,
    ...vncPM2Conf.apps,
    ...backPM2Conf.apps,
    ...tapPM2Conf.apps,
  ]
}
