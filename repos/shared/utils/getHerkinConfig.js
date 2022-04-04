/**
 * Helper to load the herkin.config for a repo
 * Loads the default herkin.config.js
 * Then tries to find configs relative to a config path or base directory
 * After the configs are loaded, it merges them together based on specificity
 * The latter override the former
 *  1. default herkin.config.js
 *  2. --base /custom/folder/containing/<herkin.config>
 *  3. --config /custom/full/path/to/<herkin.config>
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
const { tryRequireSync } = require('@keg-hub/jsutils/src/node')
const {
  isStr,
  exists,
  isFunc,
  noOpObj,
  deepMerge,
} = require('@keg-hub/jsutils')
const { aliases } = require('HerkinConfigs/aliases.config')

/**
 * **IMPORTANT**
 * Loads the default herkin.config
 * No other file should import the default herkin config
 * **IMPORTANT**
 */
const defaultConfig = require(path.join(
  aliases.HerkinRoot,
  'configs/herkin.default.config.js'
))

let __HERKIN_CONFIG

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
 * @param {Object} config - Herkin config or RepoClass instance
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
 * @return {Object} - The herkin config if the config exists at baseDir/<folder>/herkin.config.js, else null
 */
const loadConfigFromFolder = baseDir => {
  return ['', './config', './configs', './herkin', './test', './tests'].reduce(
    (found, loc) => found || getConfigAtPath(path.join(baseDir, loc)),
    false
  )
}

/**
 * Tries to find the herkin.config.js(on) file at `cwd`
 * @param {string} pathToCheck - directory path to check
 *
 * @return {Object?} - the herkin config if the config exists at $(cwd)/herkin.config.js, else null
 */
const getConfigAtPath = pathToCheck => {
  const validNames = [
    '.herkinrc',
    `.herkinrc.json`,
    `.herkinrc.yaml`,
    `.herkinrc.yml`,
    `.herkinrc.js`,
    `.herkinrc.cjs`,
    `herkin.config.json`,
    `herkin.config.js`,
    `herkin.config.cjs`,
  ]

  const paths = validNames.map(name => path.join(pathToCheck, name))

  for (const loc of paths) {
    // Always clear out the node require cache
    // This ensure we get a fresh file every time
    // Otherwise changed files would not get reloaded
    delete require.cache[loc]

    const config = tryRequireSync(loc)
    if (config) return loadConfigByType(config)
  }

  return null
}

/**
 * Searches the file system, from the current working directory
 * upwards to the root directory, for the herkin config
 * @param {string} startDir - Directory where the search should be started
 *
 * @return {Object?} - the herkin config if the config is found, else null
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
 * Loads a herkin.config from a folder path recursively
 * @param {string} base - Folder to start the search from
 *
 * @return {Object?} - the herkin config if the config exists at $(cwd)/herkin.config.js, else null
 */
const loadConfigFromBase = base => {
  base = base || process.env.HERKIN_CONFIG_BASE
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

  const startDir = fs.lstatSync(cleanedDir).isDirectory()
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
    : process.env.HERKIN_CONFIG_PATH

  try {
    // Always clear out the node require cache
    // This ensure we get a fresh file every time
    // Otherwise changed files would not get reloaded
    delete require.cache[configPath]

    const customConfig = configPath
      ? require(path.resolve(configPath))
      : search && findConfig()

    return loadConfigByType(customConfig)
  } catch (err) {
    if (configPath) throw err

    // if config is not specified by param or env,
    // try finding it at the execution directory
    return search && findConfig()
  }
}

/**
 * Gets the Herkin application config from a number of sources
 * @param {object} argsConfig - Config options passed at runtime
 *
 * @return {Object} - Loaded Herkin config
 */
const getHerkinConfig = (argsConfig = noOpObj) => {
  if (__HERKIN_CONFIG) return __HERKIN_CONFIG

  const baseConfig = loadConfigFromBase(argsConfig.base)
  const customConfig = loadCustomConfig(argsConfig.config)

  if (!customConfig && argsConfig.local && argsConfig.warn) {
    Logger.warn(
      `\n[ WARNING ] ${Logger.colors.red("Can't find a herkin.config file")}\n`
    )
    Logger.pair(
      `  * Defaulting to`,
      `"keg-herkin/configs/herkin.default.config.js"`
    )
    Logger.warn(`        * Work will not be saved`)
    Logger.log(`  * To use your own config, either:`)
    Logger.log(`        * Specify a path with "--config <path>"; or `)
    Logger.log(
      `        * Ensure a config exists in your current working directory or above it\n`
    )
  }

  __HERKIN_CONFIG = addConfigFileTypes(
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
  __HERKIN_CONFIG.internalPaths = defaultConfig.internalPaths

  return __HERKIN_CONFIG
}

/**
 * Resets the loaded herkin config
 *
 * @returns {void}
 */
const resetHerkinConfig = () => {
  __HERKIN_CONFIG = undefined
}

module.exports = {
  findConfig,
  getConfigAtPath,
  getHerkinConfig,
  loadCustomConfig,
  loadConfigFromFolder,
  resetHerkinConfig,
}