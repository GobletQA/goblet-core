const {noOpObj } = require('@keg-hub/jsutils')
const { startBrowser } = require('./startBrowser')



const statusBrowser = async (browserConf = noOpObj) => {
  return await startBrowser(browserConf)
}


module.exports = {
  statusBrowser,
}
