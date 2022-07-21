/**
 * Helper to load the goblet.config for a repo
 * Loads the default goblet.config.js
 * Then tries to find configs relative to a config path or base directory
 * After the configs are loaded, it merges them together based on specificity
 * The latter override the former
 *  1. default goblet.config.js
 *  2. --base /custom/folder/containing/<goblet.config>
 *  3. --config /custom/full/path/to/<goblet.config>
 *
 * At some point this should extracted out into it's own module
 * And probably added to keg-cli or in cli-utils
 * The hard-coded values would have to be removed and passed on as arguments
 * But it wouldn't take mush to make this a general tool for finding configs
 *
 */

const fs = require('fs')
const path = require('path')
const { Logger } = require('@keg-hub/cli-utils')
const { getFileTypes } = require('./getFileTypes')
const {
  isStr,
  exists,
  isFunc,
  noOpObj,
  deepMerge,
} = require('@keg-hub/jsutils')
const { aliases } = require('@GConfigs/aliases.config')

/**
 * **IMPORTANT**
 * Loads the default goblet.config
 * No other file should import the default goblet config
 * **IMPORTANT**
 */
const defaultConfig = require(path.join(
  aliases.GobletRoot,
  'configs/goblet.default.config.js'
))

let __GOBLET_CONFIG

/**
 * Checks if the passed in config is a function and calls it if it is
 * @param {Object|function} config - Config to be loaded
 *
 * @return {*} - The response of the config function, or the config if it's not a function
 */
const loadConfigByType = (config, ...args) => {
  return isFunc(config) ? config(...args) : config
}

/**
 * Adds the fileTypes to the config if they don't already exist
 * @param {Object} config - Goblet config or RepoClass instance
 *
 * @return {Object} - Config with the fileTypes added
 */
const addConfigFileTypes = config => {
  if (!config || !config?.paths?.repoRoot || exists(config.fileTypes))
    return config

  // Add the fileTypes if they don't already exist
  config.fileTypes = getFileTypes(config?.paths?.repoRoot, config?.paths)

  return config
}

/**
 * Loops through the possible folder locations
 * and calls getConfigAtPath for each one
 * Until it finds a config
 * @param {string} baseDir - Base directory to search from
 *
 * @return {Object} - The goblet config if the config exists at baseDir/<folder>/goblet.config.js, else null
 */
const loadConfigFromFolder = baseDir => {
  return ['', './config', './configs', './goblet', './test', './tests'].reduce(
    (found, loc) => found || getConfigAtPath(path.join(baseDir, loc)),
    false
  )
}

/**
 * Tries to find the goblet.config.js(on) file at `cwd`
 * @param {string} pathToCheck - directory path to check
 *
 * @return {Object?} - the goblet config if the config exists at $(cwd)/goblet.config.js, else null
 */
const getConfigAtPath = pathToCheck => {

  const validNames = [
    '.gobletrc',
    `.gobletrc.json`,
    `.gobletrc.yaml`,
    `.gobletrc.yml`,
    `.gobletrc.js`,
    `.gobletrc.cjs`,
    `.gobletrc.mjs`,
    // `.gobletrc.ts`,
    // `.gobletrc.cts`
    // `.gobletrc.mts`,
    `goblet.config.json`,
    `goblet.config.js`,
    `goblet.config.cjs`,
    `goblet.config.mjs`,
    // `goblet.config.ts`,
    // `goblet.config.cts`,
    // `goblet.config.mts`
  ]

  const paths = validNames.map(name => path.join(pathToCheck, name))

  for (const loc of paths) {
    // Always clear out the node require cache
    // This ensure we get a fresh file every time
    // Otherwise changed files would not get reloaded
    delete require.cache[loc]
    try {
      // TODO: typescript - update this to allow loading .ts file extensions
      const config = fs.existsSync(loc) ? require(loc) : null
      if (config) return loadConfigByType(config)
    }
    catch(err){
      console.log(`Error loading repo config...`)
      console.error(err.stack)
    }
  }

  return null
}

/**
 * Searches the file system, from the current working directory
 * upwards to the root directory, for the goblet config
 * @param {string} startDir - Directory where the search should be started
 *
 * @return {Object?} - the goblet config if the config is found, else null
 */
const findConfig = startDir => {
  let currentPath = startDir || process.cwd()
  while (currentPath != '/') {
    const configAtPath = loadConfigFromFolder(currentPath)
    if (configAtPath) return configAtPath
    currentPath = path.join(currentPath, '../')
  }
  return null
}

/**
 * Loads a goblet.config from a folder path recursively
 * @param {string} base - Folder to start the search from
 *
 * @return {Object?} - the goblet config if the config exists at $(cwd)/goblet.config.js, else null
 */
const loadConfigFromBase = base => {
  const {
    GOBLET_CONFIG_BASE,
    GOBLET_RUN_FROM_CI,
  } = process.env

  // Check if running from a CI environment and the GOBLET_CONFIG_BASE is set
  base = base || GOBLET_CONFIG_BASE

  if (!base) return null

  const cleanedDir = path.normalize(base)

  if (!fs.existsSync(cleanedDir)) {

    Logger.warn(
      [
        `\n`,
        `[ WARNING ] `,
        Logger.colors.red(
          `The base path does not exist on the host file-system\n`
        ),
        Logger.colors.white(`  base => `),
        Logger.colors.yellow(base),
        `\n`,
      ].join('')
    )

    return null
  }
  
  const stat = fs.lstatSync(cleanedDir)
  const startDir = stat.isDirectory() || (GOBLET_RUN_FROM_CI && stat.isSymbolicLink())
    ? cleanedDir
    : path.dirname(cleanedDir)

  return findConfig(startDir)
}

/**
 * Loads a custom config from an ENV, or passed in option
 * @param {Object} params
 * @param {string} params.config - Path to the custom config file
 * @param {string} params.base - Base directory to load the custom config from
 * @param {boolean} [search=true] - Search for the config if not found at path
 *
 * @return {Object} - Loaded custom config, or null if not found
 */
const loadCustomConfig = (runtimeConfigPath, search = true) => {
  const configPath = isStr(runtimeConfigPath)
    ? runtimeConfigPath
    : process.env.GOBLET_CONFIG_PATH

  try {
    // Always clear out the node require cache
    // This ensure we get a fresh file every time
    // Otherwise changed files would not get reloaded
    delete require.cache[configPath]

    const customConfig = configPath
      ? require(path.resolve(configPath))
      : search && findConfig()

    return customConfig && loadConfigByType(customConfig)
  }
  catch (err) {
    if (configPath) throw err

    // if config is not specified by param or env,
    // try finding it at the execution directory
    return search && findConfig()
  }
}

/**
 * Gets the Goblet application config from a number of sources
 * @param {object} argsConfig - Config options passed at runtime
 *
 * @return {Object} - Loaded Goblet config
 */
const getGobletConfig = (argsConfig = noOpObj) => {
  // TODO: need a better way to handle this
  if (!Boolean(process.env.JEST_WORKER_ID) && __GOBLET_CONFIG) return __GOBLET_CONFIG

  const baseConfig = loadConfigFromBase(isStr(argsConfig.base) && argsConfig.base)
  const customConfig = loadCustomConfig(argsConfig.config)

  if (!customConfig && argsConfig.local && argsConfig.warn) {
    Logger.warn(
      `\n[ WARNING ] ${Logger.colors.red("Can't find a goblet.config file")}\n`
    )
    Logger.pair(
      `  * Defaulting to`,
      `"goblet/configs/goblet.default.config.js"`
    )
    Logger.warn(`        * Work will not be saved`)
    Logger.log(`  * To use your own config, either:`)
    Logger.log(`        * Specify a path with "--config <path>"; or `)
    Logger.log(
      `        * Ensure a config exists in your current working directory or above it\n`
    )
  }

  __GOBLET_CONFIG = addConfigFileTypes(
    deepMerge(
      defaultConfig,
      // Base if a folder path, not a config file path
      baseConfig,
      // Comes after baseConfig because it's more specific
      customConfig
    )
  )

  // The default config.internalPaths should never be overwritten
  // So reset it here just in case it was
  __GOBLET_CONFIG.internalPaths = defaultConfig.internalPaths

  return __GOBLET_CONFIG
}

/**
 * Resets the loaded goblet config
 *
 * @returns {void}
 */
const resetGobletConfig = () => {
  __GOBLET_CONFIG = undefined
}

/**
 * Returns the default goblet config
 * Should not be used for loading repo information
 *
 * @returns {Object} - default Goblet Config
 */
const getDefaultGobletConfig = () => {
  return defaultConfig
}

module.exports = {
  findConfig,
  getConfigAtPath,
  getGobletConfig,
  loadCustomConfig,
  getDefaultGobletConfig,
  loadConfigFromFolder,
  resetGobletConfig,
}
