const path = require('path')
const { exists } = require('@keg-hub/jsutils')

const resolveRoot = () => {
if(!exists(process.env.GB_CAXA_COMPILED)) return __dirname

  const cwd = process.cwd()

  const GobletRoot = process.argv[2]
    ? path.join(process.argv[2], `bundle`)
    : cwd.includes(`/bundle/`)
      ? path.join(cwd.split(`/bundle/`).shift(), `bundle`)
      : __dirname

  return GobletRoot
}

module.exports = {
  GobletRoot: resolveRoot()
}