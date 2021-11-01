const os = require('os')
const fs = require('fs')
const path = require('path')
const { HERKIN_ROOT } = require('HerkinBackConstants')
const { fileSys, Logger } = require('@keg-hub/cli-utils')
const { checkVncEnv } = require('../../utils/vncActiveEnv')
const {
  isStr,
  isObj,
  exists,
  noOpObj,
  validate,
} = require('@keg-hub/jsutils')

const {
  mkDir,
  readFile,
  writeFile,
  pathExists,
  removeFile,
  pathExistsSync,
} = fileSys

const { HERKIN_PW_METADATA_PATH } = process.env

/**
 * Finds the path to metadata json folder
 * If using host browser, then use the keg-herkin root dir
 * Else if Vnc is running, then use the os temp directory
 * @type {string}
 */
const META_DIR = exists(HERKIN_PW_METADATA_PATH) && pathExistsSync(HERKIN_PW_METADATA_PATH)
  ? HERKIN_PW_METADATA_PATH
  : checkVncEnv().vncActive
    ? path.resolve(os.tmpdir(), 'keg-herkin')
    : HERKIN_ROOT

/**
 * Full path to metadata json file
 * @type {string}
 */
const META_PATH = path.resolve(META_DIR, 'browser-meta.json')

/**
 * Loads the metadata json file from the META_PATH value
 * @return {string?} contents of the browser-meta.json file or null
 */
const tryReadMeta = async () => {
  const [err, content] = await readFile(META_PATH, 'utf8')
  return err ? null : content
}

/**
 * Creates the browser metadata file if it does not exist
 * @param {Object} content - Initial content of the file
 *
 * @return {Void}
 */
const create = async (content=noOpObj) => {
  const [existsErr, exists] = await pathExists(META_DIR)
  !exists &&  await mkDir(META_DIR)
  const [err, _] = await writeFile(META_PATH, JSON.stringify(content, null, 2))
  err && Logger.error(err)
}

/**
 * Reads browser metadata from file
 * @param {string?} [type] - specific browser to return. If omitted, returns all metadata.
 *
 * @return {Object} - json of the metadata
 */
const read = async type => {
  try {
    const data = await tryReadMeta()
    const parsed = data ? JSON.parse(data) : {}
    const value = isObj(parsed) && type
      ? parsed[type]
      : parsed
    return value || {}
  }
  catch (err) {
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
  const [ valid ] = validate({ type, endpoint }, { $default: isStr })
  if (!valid) return

  const content = await read()

  const nextMetadata = {
    ...content,
    [type]: {
      type,
      endpoint,
      launchOptions,
      launchTime: new Date().getTime(),
    }
  }

  const [err, _] = await writeFile(
    META_PATH,
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
  return await removeFile(META_PATH)
}

module.exports = { create, read, remove, save, location: META_PATH }