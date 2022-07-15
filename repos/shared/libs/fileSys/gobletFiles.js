const path = require('path')
const { wordCaps, get } = require('@keg-hub/jsutils')
const { loadReport } = require('@GSH/Utils/loadReport')
const { loadFeature } = require('@GSH/Features/features')
const { loadTemplate } = require('@GSH/Template/loadTemplate')
const { buildFileModel } = require('@GSH/Utils/buildFileModel')
const { resolveFileType } = require('@GSH/Utils/resolveFileType')
const { getRepoGobletDir } = require('@GSH/Utils/getRepoGobletDir')

const {
  readFile,
  removeFile,
  writeFile,
  mkDir,
  pathExists,
} = require('./fileSys')

/**
 * Checks that the file path exists
 * @param {String} location - file path to check
 * @throw {Error} if location not found on file system
 */
const checkPathExists = async location => {
  const [err, exists] = await pathExists(location)
  if (err || !exists) {
    const pathError = new Error(`Path not found: ${location}`)
    pathError.status = 404
    throw pathError
  }
}

/**
 * Deletes a file at a given location. file should be located in the test root path
 * @param {Object} repo - Repo Class instance for the currently active repo
 * @param {string} location - Location within the test root path the file should be deleted
 *
 * @returns {Object} - Contains boolean if delete was successful and its location
 */
const deleteGobletFile = async (repo, location) => {
  await checkPathExists(location)


  // Check that the file being remove is in the mounted repo folder
  // This ensure no other files can be removed
  const { repoRoot } = repo.paths
  const inTestRoot = location.startsWith(repoRoot)

  if(!inTestRoot){
    const noPermission = new Error(
      `You do not have permission to preform this action!`
    )
    noPermission.status = 403
    throw noPermission
  }

  const [err] = await removeFile(location)
  if (err) {
    const error = new Error(
      `File could not be removed: ${location}`
    )
    error.status = 404
    throw error
  }

  return {
    location,
    success: true,
  }
}

/**
 * Checks the files path and if it exists creates a fileModel from the meta data
 * @param {Object} repo - Repo Class instance for the currently active repo
 * @param {string} location - Location within the test root path the file should exist
 *
 * @returns {Object} - fileModel for the file at the passed in location
 */
const getGobletFile = async (repo, location) => {
  const baseDir = getRepoGobletDir(repo)

  const fullPath = location.startsWith(baseDir)
  ? location
  : path.join(baseDir, location)

  await checkPathExists(fullPath)

  // Check the fileType, and handle some files with their own method
  const fileType = resolveFileType(repo, fullPath)

  if(fileType === get(repo, `fileTypes.feature.type`))
    return await loadFeature(repo, fullPath)
  else if(fileType === get(repo, `fileTypes.report.type`))
    return await loadReport(repo, fullPath, baseDir)

  // Build the file model for the file
  const [_, content] = await readFile(fullPath)

  return await buildFileModel({
    content,
    fileType,
    location: fullPath,
  }, repo)
}


/**
 * Save a definition file in the mounted repo when it's a modified version of the default definitions
 * @param {Object} repo - Repo Class instance for the currently active repo
 * @param {string} location - Location within the test root path the file should be saved
 * @param {string} content - Content of the file to be saved
 *
 * @returns {Object} - Contains boolean if save was successful and its fileModel
 */
const saveDefinitionToRepo = async (repo, location) => {
  const definitionType = get(repo, `fileTypes.definition`)
  if(!definitionType || !definitionType.location){
    const noDefinitionType = new Error(
      `Definition file type does not exist for mounted repo!`
    )
    noDefinitionType.status = 404
    throw noDefinitionType
  }

  return path.join(definitionType.location, path.basename(location))
}

/**
 * Save file at a given location. file should be located in the test root path
 * @param {Object} repo - Repo Class instance for the currently active repo
 * @param {string} location - Location within the test root path the file should be saved
 * @param {string} content - Content of the file to be saved
 * @param {string} type - The file type being saved
 *
 * @returns {Object} - Contains boolean if save was successful and its fileModel
 */
const saveGobletFile = async (repo, location, content, type) => {
  const { repoRoot } = repo.paths

  const inTestRoot = location.startsWith(repoRoot)
  
  let saveLocation = location

  // Check the file type, and if it's a definition then create a new definition file
  // This allows saving definitions form the standard lib in to the users lib
  // Should then override the standard lib definition file
  if (!inTestRoot){
    if(get(repo, `fileTypes.definition.type`) !== type){
      const repoOnlyError = new Error(
        `File must be saved to the mounted test folder!`
      )
      repoOnlyError.status = 403
      throw repoOnlyError
    }

    // Overwrite the save location with the update path to the file location within the repo
    saveLocation = await saveDefinitionToRepo(repo, location)
  }

  const [err, success] = await writeFile(saveLocation, content)

  if (err) {
    console.log(err)
    const pathError = new Error(
      `Save failed: ${saveLocation} - ${err.message}`
    )
    pathError.status = 404
    throw pathError
  }

  return {
    success: Boolean(success),
    file: await buildFileModel({
      content,
      location: saveLocation,
    }, repo)
  }
}

/**
 * Create a file based on location and fileName
 * Only saved within the docker mounted test root path
 * @param {Object} repo - Repo Class instance for the currently active repo
 * @param {string} fileName - Name / Location of the file to be saved
 * @param {string} fileType - The type of file to be saved, one of the FILE_TYPES constants
 *
 * @returns {Object} - Contains boolean if create was successful and its fileModel
 */
const createGobletFile = async (repo, fileName, fileType) => {
  const { fileTypes } = repo
  const foundType = fileTypes[fileType]

  // Ensure the test type exists
  // If not, then we can't create the file
  if (!foundType)
    throw new Error(`Invalid test type "${fileType}". Must be one of\n${Object.keys(fileTypes)}`)

  // Build the path to the file and it's meta data
  const location = path.join(foundType.location, fileName)

  // Check if the path already exists, so we don't overwrite an existing file
  const [existsErr, fileExists] = await pathExists(location)
  if (fileExists) throw new Error(`File already exists at that location!`)

  const basename = path.basename(location)
  const dirname = path.dirname(location)

  // Ensure the directory exists for the file
  const [mkDirErr, mkDirSuccess] = await mkDir(dirname)
  if (mkDirErr) throw new Error(mkDirErr)

  // Create the new test file using the template for the file type
  // In the future we might want to allow custom templates from the mounted tests folder
  // But that's a lot more work
  const content = await loadTemplate(fileType, {
    name: wordCaps(basename.split('.').shift()),
  })

  const [writeErr, writeSuccess] = await writeFile(location, content)
  if (writeErr) throw new Error(writeErr)

  return {
    success: Boolean(writeSuccess),
    // Build the file model for the new test file
    file: await buildFileModel(
      {
        content,
        fileType,
        location,
      },
      repo
    ),
  }
}

module.exports = {
  createGobletFile,
  deleteGobletFile,
  getGobletFile,
  saveGobletFile,
}
