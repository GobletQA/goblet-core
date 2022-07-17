const path = require('path')

const resolveRoot = () => {
  const fileName = __filename.split(`/`).pop()
  if(fileName === `gobletRoot.js`) return __dirname

  const cwd = process.cwd()

  // Check if in caxa compiled variant
  if(process.env.GB_CAXA_COMPILED){
    return process.argv[2]
      ? path.join(process.argv[2], `dist`)
      : cwd.includes(`/dist/`)
        ? path.join(cwd.split(`/dist/`).shift(), `dist`)
        : __dirname
  }

  // Check if there's a /repos in the path, and take the parent folder
  return cwd.includes(`/repos/`)
    ? path.join(cwd.split(`/repos/`).shift())
    : __dirname

}

module.exports = {
  GobletRoot: resolveRoot()
}