const fs = require('fs')
const path = require('path')
const { fileSys } = require('@keg-hub/cli-utils')
const { get, limbo } = require('@keg-hub/jsutils')

const { mkDir, removeFile, copyStream } = fileSys
const nameCache = {}

/**
 * Formats the passed in location file name
 * Removes parent dirs, file extension and spaces in the file name
 * @param {string} location - File location that should have it's name formatted
 *
 * @returns {string} - Formatted file name
 */
const formatName = (location) => {
  return location.split(`/`)
    .pop()
    .split('.')
    .shift()
    .trim()
    .replace(/ /g, '-')
}

/**
 * Gets the name of the most recently run test
 * @param {string} override - Override the name pulled from jasmine global object
 *
 * @returns {Object} - Contains the short name and full generated path name
 */
const getGeneratedName = (testLoc, type, browserName) => {
  const testPath = testLoc || global?.jasmine?.testPath
  const testType = type || get(global, `__goblet.options.testType`)
  const browser = browserName || get(global, `__goblet.browser.options.type`, 'browser')

  const timestamp = new Date().getTime()
  const name = formatName(testPath)

  // Use a cache name to ensure all generated artifacts use the same timestamp
  const cacheName = browser ? `${testType}-${browser}-${name}` : `${testType}-${name}`
  if(nameCache[cacheName]) return nameCache[cacheName]

  const nameTimestamp = browser ? `${name}-${browser}-${timestamp}` : `${name}-${timestamp}`

  nameCache[cacheName] = {
    name,
    testPath,
    nameTimestamp,
    dir: `${testType}/${name}`,
    full: `${testType}/${name}/${nameTimestamp}`,
  }

  return nameCache[cacheName]
}

/**
 * Moves an artifact from the temp save location to the location defined in the repo  config location
 * All artifacts are saved to a temp directory
 * Then copied to the repo directory based on configured settings - I.E. `only-on-fail`
 * @param {string} saveLoc - The location where the artifact should be saved to
 * @param {string} name - Name of the artifact file without extension
 * @param {string} currentLoc - Temp location where the artifact currently exists
 *
 * @returns {string} - Repo location where the artifact was copied to
 */
const copyArtifactToRepo = async (saveLoc, name, currentLoc) => {
  const saveFull = name
    ? path.join(saveLoc, `${name}${path.extname(currentLoc)}`)
    : saveLoc

  // Ensure the folder path exists before the file copy
  await mkDir(path.dirname(saveFull))
  fs.copyFileSync(currentLoc, saveFull)

  const [rmErr] = await removeFile(currentLoc)
  if(rmErr) throw rmErr

  return saveFull
}

/**
 * Ensures a repo artifact sub-folder exists
 * @param {string} parentDir - Root artifact type folder location 
 * @param {string} childDir - Sub folder where an artifact relative to a test will be saved
 *
 * @returns {string} - Repo location folder where an artifact will be saved
 */
const ensureRepoArtifactDir = async (parentDir, childDir) => {
  const saveDir = childDir ? path.join(parentDir, childDir) : parentDir
  const [mkErr] = await mkDir(saveDir)
  if(mkErr) throw mkErr

  return saveDir
}


module.exports = {
  getGeneratedName,
  copyArtifactToRepo,
  ensureRepoArtifactDir
}