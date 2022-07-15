const os = require('os')
const path = require('path')
const { fileSys, Logger } = require('@keg-hub/cli-utils')
const { getGobletConfig } = require('@GSH/Config')
const { checkVncEnv } = require('../../utils/vncActiveEnv')
const { isStr, isObj, exists, noOpObj, validate } = require('@keg-hub/jsutils')

const { mkDir, readFile, writeFile, pathExists, removeFile, pathExistsSync } =
  fileSys

/**
 * Finds the path to metadata folder and browser-meta.json file
 * If using host browser, then use the goblet root dir
 * Else if Vnc is running, then use the os temp directory
 * @type {function}
 *
 * @return {Object} - Contains metadata directory and file path
 */
const getMetaDataPaths = () => {
  const config = getGobletConfig()
  const { gobletRoot, pwMetaDataDir } = config.internalPaths

  const metadataDir =
    exists(pwMetaDataDir) && pathExistsSync(pwMetaDataDir)
      ? pwMetaDataDir
      : checkVncEnv().vncActive
      ? path.resolve(os.tmpdir(), 'goblet')
      : gobletRoot

  const metadataPath = path.resolve(metadataDir, 'browser-meta.json')

  return { metadataPath, metadataDir }
}

/**
 * Loads the metadata json file from the metadataPath value
 * @return {string?} contents of the browser-meta.json file or null
 */
const tryReadMeta = async () => {
  const { metadataPath } = getMetaDataPaths()

  const [err, content] = await readFile(metadataPath, 'utf8')
  return err ? null : content
}

/**
 * Creates the browser metadata file if it does not exist
 * @param {Object} content - Initial content of the file
 *
 * @return {Void}
 */
const create = async (content = noOpObj) => {
  const { metadataPath, metadataDir } = getMetaDataPaths()
  const [existsErr, exists] = await pathExists(metadataDir)

  !exists && (await mkDir(metadataDir))
  const [err, _] = await writeFile(
    metadataPath,
    JSON.stringify(content, null, 2)
  )
  err && Logger.error(err)
}

/**
 * Reads browser metadata from file
 * @param {string?} [type] - specific browser to return. If omitted, returns all metadata
 *
 * @return {Object} - json of the metadata
 */
const read = async type => {
  try {
    const data = await tryReadMeta()
    const parsed = data ? JSON.parse(data) : {}
    const value = isObj(parsed) && type ? parsed[type] : parsed
    return value || {}
  } catch (err) {
    Logger.error(err)
    return {}
  }
}

/**
 * Saves browser metadata to file
 * @param {string} type - browser type (chromium, firefox, webkit, etc.)
 * @param {string} endpoint - websocket endpoint to the browser
 * @param {Object} launchOptions - playwright launch options used (e.g. { headless: false })
 *
 * @return {Void}
 */
const save = async (type, endpoint, launchOptions) => {
  const { metadataPath } = getMetaDataPaths()
  const [valid] = validate({ type, endpoint }, { $default: isStr })
  if (!valid) return

  const content = await read()

  const nextMetadata = {
    ...content,
    [type]: {
      type,
      endpoint,
      launchOptions,
      launchTime: new Date().getTime(),
    },
  }

  const [err, _] = await writeFile(
    metadataPath,
    JSON.stringify(nextMetadata, null, 2)
  )

  err && err.code === 'ENOENT'
    ? await create(nextMetadata)
    : err && Logger.error(err)
}

/**
 * Removes the metadata to file
 *
 * @return {Void}
 */
const remove = async () => {
  const { metadataPath } = getMetaDataPaths()
  return await removeFile(metadataPath)
}

/**
 * Gets the location to where the browser metadata file is saved
 *
 * @return {Void}
 */
const location = () => {
  const { metadataPath } = getMetaDataPaths()

  return metadataPath
}

module.exports = { create, read, remove, save, location }
