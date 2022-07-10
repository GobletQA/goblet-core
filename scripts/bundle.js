const path = require('path')
const { build } = require('esbuild')
const { limbo, deepMerge } = require('@keg-hub/jsutils')
const { Logger, fileSys } = require('@keg-hub/cli-utils')
const aliasPlugin = require('esbuild-plugin-path-alias')
const {aliases, registerAliases} = require('../configs/aliases.config')

const isDev = process.env.NODE_ENV !== 'production'
const { copyFile, mkDir, copySync, emptyDirSync, removeFile } = fileSys
registerAliases()

const rootDir = path.join(__dirname, '../')
const bundleDir = path.join(rootDir, 'bundle')
const outDir = path.join(bundleDir, 'repos')

const locations = {
  outDir,
  rootDir,
  bundleDir,
  goblet: `goblet`,
  configs: `configs`,
  nm: `node_modules`,
  container: `container`,
  shared: `repos/shared`,
  package: `package.json`,
  backend: `repos/backend/index.js`,
  config: `goblet.default.config.js`,
  templates: `repos/shared/templates`,
  screencast: `repos/screencast/index.js`,
}
const removeConfigs = [
  `eslintrc.config.js`,
  `firebase.config.js`
]


const onError = (msg, err) => {
  msg && Logger.error(msg)
  err && Logger.log(err.stack)
  process.exit(1)
}

const setupLogger = () => {
  Logger.setTag(`[Goblet]`, `gray`)
  Logger.toggleTag()
}

const dupFile = async (location) => {
  const loc = locations[location]
  return await copyFile(path.join(rootDir, loc), path.join(bundleDir, loc))
}

const dupDir = async (location) => {
  const loc = locations[location]
  try {
    if(!loc) throw new Error(`The location ${loc} is invalid`)
    copySync(path.join(rootDir, loc), path.join(bundleDir, loc))
  }
  catch(err){
    onError(`Error copying location ${location} - ${loc}`, err)
  }
}

const cleanBundleDir = async () => {
  Logger.log(`Cleaning Bundle directory...`)
  emptyDirSync(bundleDir)
}

const buildConfig = (config) => {
  return deepMerge({
    bundle: true,
    color: true,
    format: 'cjs',
    minify: false,
    platform: 'node',
    logLevel: 'info',
    allowOverwrite: true,
    outdir: locations.outDir,
    absWorkingDir: locations.rootDir,
    entryPoints: [],
    external: [`./node_modules/*`],
    plugins: [aliasPlugin(aliases)]
  }, config)
}


const makeBackendBundle = async () => {
  Logger.log(`Running esbuild for Backend-API...`)
  const [err, result] = await limbo(build(buildConfig({
    entryPoints: [
      locations.backend,
      locations.screencast,
    ],
  })))

  err ? onError(`Error bundling Backend-API!`, err) : Logger.log(result)

}

const makeConfigBundle = async () => {
  Logger.log(`Running esbuild for Goblet config...`)
  const [err, result] = await limbo(build(buildConfig({
    outdir: path.join(bundleDir, locations.configs),
    entryPoints: [
      path.join(rootDir, locations.configs, locations.config)
    ],
  })))

  err ? onError(`Error bundling Goblet config!`, err) : Logger.log(result)
}

/**
 * Helper to copy assets that can't be bundled with esbuild
 */
const copyAssets = async () => {
  Logger.log(`Copying assets to bundle directory...`)
  await mkDir(`shared`)
  await dupDir(`goblet`)
  await dupDir(`configs`)
  await dupFile(`package`)
  await dupDir(`container`)
  await dupDir(`templates`)

  // Only copy over node_modules when building for production
  if(isDev) return

  Logger.log(`Copying node_modules to bundle directory...`)
  await dupDir(`nm`)
}


const cleanupConfigs = async () => {
  
  await removeFile()
}

/**
 * Automatically executes building the bundle
 * Cleans the bundle folder first
 * Then generates bundle and copies assets
 */
;(async () => {

  Logger.log(`Building Backend-API...`)

  setupLogger()
  await cleanBundleDir()
  await makeBackendBundle()
  await makeConfigBundle()
  await copyAssets()
  await cleanupConfigs()

  Logger.success(`\nBackend-API build complete\n`)

})()