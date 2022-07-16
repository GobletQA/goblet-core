const { setupBuild } = require('./setupBuild')
const { appRoot, distDir, coreBuildDir } = require('../../paths')
const { Logger, yarn, runCmd, fileSys } = require('@keg-hub/cli-utils')

const bundleCmd = `web:bundle`

/**
 * **IMPORTANT** - Called from within the docker container when using the deploy task
 *
 * Builds the frontend application, then copies it to the app-root/dist/tap directory
 * @function
 * @public
 * @param {Object} args.params - Options passed to the task parsed as an object
 * @param {Object} args.envs - Envs loaded for the current environment
 * @param {Object} args.deploy - Loaded deploy config
 * 
 * @returns {string} - Found firebase project name
 */
const buildFrontend = async args => {
  const { envs, params } = args
  const { log } = params

  const cmdOpts = {cwd: appRoot, envs}

  log && Logger.log(`Installing sharp-cli and it's dependencies...`)
  await runCmd(`apt`, [`install`, `-y`, `g++`, `make`], { ...cmdOpts })
  await yarn([`global`, `add`, `sharp-cli`], cmdOpts)

  // Build the tap frontend application
  log && Logger.pair(`Running frontend build command`, `yarn ${bundleCmd}`)
  await yarn([bundleCmd], cmdOpts)

  // Copy the build from the keg-core directory to the taps dist directory
  log && Logger.pair(`\nMoving build artifacts to`, distDir)
  fileSys.copySync(coreBuildDir, distDir)
  
  log && Logger.success(`\n[Success] ${Logger.colors.white('Frontend build completed successfully')}\n`)
}

module.exports = {
  buildFrontend: setupBuild(buildFrontend)
}