process.env.GOBLET_ENV = process.env.GOBLET_ENV || `develop`
require('esbuild-register/dist/node').register({
  loader: 'ts',
  minify: false,
  target: "es2015",
})
require('source-map-support').install({ environment: 'node' })
require('../../configs/aliases.config').registerAliases()

/**
 * Will be needed when the package is bundled
 * Still needs to be figured out
 * So for now just return __dirname
 */
const resolveRoot = () => {
  return __dirname
}

module.exports = {
  GSCRoot: resolveRoot()
}