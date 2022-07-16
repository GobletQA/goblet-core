const path = require('path')
const { build } = require('esbuild')
const { limbo, deepMerge } = require('@keg-hub/jsutils')
const { Logger, fileSys } = require('@keg-hub/cli-utils')
const aliasPlugin = require('esbuild-plugin-path-alias')
const {aliases, registerAliases} = require('../configs/aliases.config')
const { copyFile, mkDir, copySync, emptyDirSync } = fileSys

registerAliases()
Logger.setTag(`[Goblet]`, `gray`)

const rootDir = path.join(__dirname, `../`)
const distDir = path.join(rootDir, `dist`)

const locations = {
  rootDir,
  distDir,
  tasks: `tasks`,
  goblet: `goblet`,
  testUtils: `repos/testUtils/src`,
  templates: `repos/shared/src/templates`,
  testConfigs: `repos/testUtils/configs`,
  tasksIn: path.join(rootDir, `tasks/runTask.js`),
  tasksOut: path.join(distDir, `tasks`),
  containerIn: path.join(rootDir, `container`),
  containerOut: path.join(distDir, `container`),
  jestOut: path.join(distDir, `repos/testUtils/configs`),
  jestIn: path.join(rootDir, `repos/testUtils/configs/jest.default.config.js`),
  configOut: path.join(distDir, `configs`),
  configIn: path.join(rootDir, `configs/goblet.default.config.js`),
  backendOut: path.join(distDir, `repos/backend`),
  backendIn: path.join(rootDir, `repos/backend/index.js`),
  screencastOut: path.join(distDir, `repos/screencast`),
  screencastIn: path.join(rootDir, `repos/screencast/index.js`),
  containerFiles: [
    `run.sh`,
    `values.yml`,
    `values.qa.yml`,
    `values.test.yml`,
    `values.staging.yml`,
    `values.production.yml`,
  ]
}

const defConfig = {
  bundle: true,
  color: true,
  format: 'cjs',
  minify: false,
  platform: 'node',
  logLevel: 'warning',
  allowOverwrite: true,
  external: [`./node_modules/*`],
  plugins: [aliasPlugin(aliases)],
  absWorkingDir: locations.rootDir,
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
 * Helper to copy a directory relative to the repo root and dist directory
 * @param {string} loc - Location where the directory exists
 */
const dupDir = async (loc) => {
  try {
    if(!loc) throw new Error(`The location ${loc} is invalid`)
    copySync(path.join(locations.rootDir, loc), path.join(locations.distDir, loc))
  }
  catch(err){
    onError(`Error copying location ${loc}`, err)
  }
}

/**
 * Helper to clean the dist directory before building to ensure a fresh build
 */
const cleanBundleDir = async () => {
  Logger.log(`Cleaning Bundle directory...`)
  emptyDirSync(locations.distDir)
  logSuccess(`Bundle directory cleaned!`)
}

/**
 * Helper to generate a JS bundle from the passed in arguments
 * @param {string} name - Name of the app being bundled
 * @param {string} entry - Path to the apps entry file
 * @param {string} outdir - Path to the apps output directory
 *
 */
const makeBundle = async (name=`App`, entry, outdir) => {
  Logger.log(`Running esbuild for ${name}...`)

  const [err, result] = await limbo(build(
    deepMerge(defConfig, {
      outdir,
      entryPoints: [entry],
    })
  ))

  err && onError(`Error bundling ${name}!`, err)

  logSuccess(`${name} bundle complete!`)
}

/**
 * Helper to copy assets that can't be bundled with esbuild
 */
const copyAssets = async () => {
  Logger.log(`Copying assets to dist directory...`)

  await dupDir(locations.goblet)
  await dupDir(locations.testUtils)
  await dupDir(locations.templates)
  await mkDir(locations.containerOut)

  await Promise.all(
    locations.containerFiles.map(async name => {
      return await copyFile(
        path.join(locations.containerIn, name),
        path.join(locations.containerOut, name)
      )
    })
  )

  logSuccess(`Asset copy complete!`)
}

/**
 * Automatically executes esbuild to bundle the Goblet App
 * Cleans the dist folder first
 * Then generates bundle and copies assets
 */
;(async () => {

  Logger.log(`Bundling Goblet...\n`)

  await cleanBundleDir()
  await copyAssets()
  await makeBundle(`Tasks`, locations.tasksIn, locations.tasksOut)
  await makeBundle(`Jest-Config`, locations.jestIn, locations.jestOut)
  await makeBundle(`Goblet-Config`, locations.configIn, locations.configOut)
  await makeBundle(`Backend-API`, locations.backendIn, locations.backendOut)
  await makeBundle(`Screencast-API`, locations.screencastIn, locations.screencastOut)

  logSuccess(`Goblet bundling complete!\n`)

})()