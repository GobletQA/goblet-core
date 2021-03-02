const path = require('path')
const { validFilename } = require('@keg-hub/jsutils')
const { buildFileModel } = require('../../utils/buildFileModel')
const {
  readFile,
  removeFile,
  writeFile,
  pathExists,
} = require('./fileSys')


/**
 * Checks that the file path exists
 * @param {String} path - file path to check
 * @throw {Error} if path not found on file system
 */
const checkPath = async (path) => {
  const [ err, exists ] = await pathExists(path)
  if (err || !exists) {
    const pathError = new Error(`[API - Files] Path not found: ${path}`)
    pathError.status = 404
    throw pathError
  }
}

const deleteTestFile = async (config, location) => {
  const { testsRoot } = config.paths
  await checkPath(location)

  // TODO: double check that removeFile returns a value
  const [__, deleted] = await removeFile(location)

  return {
    location,
    success: Boolean(deleted),
  }
}

const getTestFile = async (config, testPath) => {

  const { testsRoot } = config.paths
  const fullPath = testPath.includes(testsRoot)
    ? testPath
    : path.join(testsRoot, testPath)

  await checkPath(fullPath)

  const [ __, content ] = await readFile(fullPath)

  // Build the file model for the test file
  return buildFileModel({
    content,
    location: fullPath,
  })
}

/**
 * Save file at a given location. file should be located in the test root path
 * @param {Object} config 
 * @param {string} fullPath
 * @param {string} content 
 */
const saveTestFile = async (config, fullPath, content) => {

  const { testsRoot } = config.paths
  if (!validFilename(path.basename(fullPath))) throw new Error(`[API - Files] Filename is invalid!`)
  const inTestRoot = fullPath.startsWith(testsRoot)
  if (!inTestRoot) throw new Error(`[API - Files] File must be saved to the mounted test folder!`)

  const [err, success] = await writeFile(fullPath, content)

  if (err) {
    console.log(err)
    const pathError = new Error(`[API - Files] Save failed: ${fullPath} - ${err.message}`)
    pathError.status = 404
    throw pathError
  }

  return {
    location,
    name: path.basename(fullPath),
    success: Boolean(success),
  }
}

module.exports = {
  deleteTestFile,
  getTestFile,
  saveTestFile
}