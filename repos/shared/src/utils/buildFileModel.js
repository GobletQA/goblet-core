const path = require('path')
const { getType } = require('mime')
const { getFileType } = require('./getFileType')
const { fileModel } = require('@GSH/Models')
const { getLastModified } = require('@GSH/FileSys/fileSys')

/**
 * Builds a fileModel from the fileModel object and passed arguments
 * @param {Object} fileModel - Partial fileModel merged with the default
 * @param {Object} [repo={}] - Repo Class instance for the currently active repo
 *
 * @returns {Object} - Built fileModel object containing all fileModel properties
 */
const buildFileModel = async (
  { location, fileType, uuid, ...modelData },
  repo
) => {
  fileType = fileType || getFileType(location, repo.fileTypes)

  return fileModel({
    ...modelData,
    fileType,
    location,
    uuid: location,
    mime: getType(location),
    name: location.split('/').pop(),
    relative: location.replace(repo.paths.repoRoot, ''),
    ext: path.extname(location).replace('.', ''),
    lastModified: await getLastModified(location),
  })
}

module.exports = {
  buildFileModel,
}
