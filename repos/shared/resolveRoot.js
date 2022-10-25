process.env.GOBLET_ENV = process.env.GOBLET_ENV || `develop`
/**
 * Will be needed when the package is bundled
 * Still needs to be figured out
 * So for now just return __dirname
 */
const resolveRoot = () => {
  return __dirname
}

module.exports = {
  GSHRoot: resolveRoot()
}