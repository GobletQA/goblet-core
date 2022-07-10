const path = require('path')
const appRoot = path.join(__dirname, '../')

module.exports = {
  appRoot,
  configs: path.join(appRoot, './configs'),
  containerDir: path.join(appRoot, './container'),
  gobletMountDir: path.join(appRoot, './goblet'),
  bundleDir: path.join(appRoot, `bundle/tap`),
  testUtilsDir: path.join(appRoot, `repos/testUtils`),
  coreBuildDir: path.join(appRoot, `node_modules/keg-core/web-build`),
}
