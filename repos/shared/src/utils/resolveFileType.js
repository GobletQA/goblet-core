
/**
 * Loops over the fileTypes from the repo looking for a matching path with the filePath
 * If found uses the matching type
 * @param {Object} repo - Goblet repo config object
 * @param {string} filePath - Path to a test file
 *
 * @returns {string|boolean} - Found test file type or false
 */
const resolveFileType = (repo, filePath) => {
  const { fileTypes } = repo

  return Object.entries(fileTypes)
  .reduce((found, [typeName, metaData]) => {
    if(found || !metaData || !metaData.location) return found
    
    return filePath.startsWith(metaData.location)
      ? metaData.type || typeName
      : found
  }, false)
}
module.exports = {
  resolveFileType,
}
