/**
    "precompile": "mkdir -p && compile && cp -R bundle compile/bundle && cp -R node_modules compile/node_modules && cp package.json compile/package.json",
    "compile": "npx caxa -D --input bundle --command \"{{caxa}}/node_modules/.bin/node\" \"{{caxa}}/repos/backend/index.js\" --output \"compile/Goblet.app\"",
 */

const path = require('path')
const { promises } = require('fs')
const { default:caxa } = require('caxa')
const { limbo } = require('@keg-hub/jsutils')
const { Logger, fileSys } = require('@keg-hub/cli-utils')
const { registerAliases } = require('../configs/aliases.config')
const { copyFile, mkDir, copySync, emptyDirSync, removeFile } = fileSys

registerAliases()
Logger.setTag(`[Goblet]`, `gray`)

const rootDir = path.join(__dirname, `../`)
const compileDir = path.join(rootDir, `compile`)
const appDir = path.join(compileDir, `app`)
const locations = {
  appDir,
  compileDir,
  bundleIn: path.join(rootDir, `bundle`),
  bundleOut: path.join(appDir, `bundle`),
  packageIn: path.join(rootDir, `package.json`),
  packageOut: path.join(appDir, `package.json`),
  nmIn: path.join(rootDir, `node_modules`),
  nmOut: path.join(appDir, `node_modules`),
}

/**
 * Helper to To get the name of the executable based on operating system
 * @returns {string} Name of the app with extension
 *
 */
const getAppName = () => {
  const ext = process.platform.startsWith(`win`)
    ? `exe`
    : process.platform.startsWith(`dar`)
      ? `app`
      : `sh`

  return `Goblet.${ext}`
}

/**
 * Helper to handle error messages
 * @exits
 * @param {string} msg - Error message to print
 * @param {Object} err - Error that was thrown
 *
 */
const onError = (msg, err) => {
  Logger.setTag(`[Goblet]`, `red`)
  msg && Logger.error(msg)
  err && console.error(err)
  process.exit(1)
}


/**
 * Helper to log success messages
 * @param {string} msg - Success message to log
 *
 */
const logSuccess = (msg) => {
  Logger.setTag(`[Goblet]`, `green`)
  Logger.log(msg)
  Logger.empty()
  Logger.setTag(`[Goblet]`, `gray`)
}

/**
 * Helper to clean the bundle directory before building to ensure a fresh build
 */
const cleanCompileDir = async () => {
  Logger.log(`Cleaning compile directory...`)
  emptyDirSync(locations.compileDir)
  logSuccess(`Compile directory cleaned!`)
}

/**
 * Helper to generate an executable using caxa
 */
const compileApp = async () => {
  Logger.log(`Running caxa for Goblet...`)

  const [err, res] = await limbo(caxa({
    dedupe: false,
    input: locations.appDir,
    output: path.join(locations.compileDir, getAppName()),
    command: [
      "env",
      `GB_CAXA_COMPILED=true`,
      "{{caxa}}/node_modules/.bin/node",
      "{{caxa}}/bundle/repos/backend/index.js",
      "{{caxa}}"
    ],
  }))

  err && onError(`Error compiling Goblet!`, err)

  logSuccess(`Caxa complete!`)
}

/**
 * Helper to copy assets that can't be bundled with esbuild
 */
const copyAssets = async () => {
  Logger.log(`Copying assets to compile directory...`)

  await mkDir(locations.appDir)
  await copySync(locations.bundleIn, locations.bundleOut)
  await copyFile(locations.packageIn, locations.packageOut)
  await copySync(locations.nmIn, locations.nmOut)

  logSuccess(`Asset copy complete!`)
}

const cleanup = async () => {
  Logger.log(`Cleaning up after compile...\n`)
  const [err] = await limbo(promises.rm(locations.appDir, { recursive: true }))
  err && onError(`Error cleaning up after compile!`, err)
}

/**
 * Automatically executes compiling the bundled Goblet App
 * Cleans the compile folder first
 * Then generates an executable and copies assets
 */
;(async () => {
  Logger.log(`Compiling Goblet executable...\n`)

  await cleanCompileDir()
  await copyAssets()
  await compileApp()
  await cleanup()

  logSuccess(`Goblet compiling complete!\n`)

})()