const path = require('path')
const appRoot = path.join(__dirname, '../')

module.exports = {
  appRoot,
  configs: path.join(appRoot, './configs'),
  containerDir: path.join(appRoot, './container'),
  herkinMountDir: path.join(appRoot, './herkin'),
  bundleDir: path.join(appRoot, `bundle/tap`),
  coreBuildDir: path.join(appRoot, `node_modules/keg-core/web-build`),
}
