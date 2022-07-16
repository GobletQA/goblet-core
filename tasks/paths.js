const path = require('path')
const { GobletRoot } = require('../gobletRoot')

module.exports = {
  appRoot: GobletRoot,
  distDir: path.join(GobletRoot, `dist/tap`),
  configs: path.join(GobletRoot, './configs'),
  containerDir: path.join(GobletRoot, './container'),
  gobletMountDir: path.join(GobletRoot, './goblet'),
  testUtilsDir: path.join(GobletRoot, `repos/testUtils`),
  coreBuildDir: path.join(GobletRoot, `node_modules/keg-core/web-build`),
}
