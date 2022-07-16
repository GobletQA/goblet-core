/**
 * Gets the file type based on location and allowed fileTypes
 * @param {string} location - Location of the file to get the test type for
 * @param {Object} fileTypes - Repo instance.fileTypes property - (Allowed file types)
 *
 * @returns {string} - Found file type, one of the fileTypes property keys
 */
const getFileType = (location, fileTypes) => {
  const foundFileType = Object.entries(fileTypes).reduce(
    (foundType, [type, typeMeta]) => {
      return !foundType && location.startsWith(typeMeta.location)
        ? typeMeta
        : foundType
    },
    ''
  )

  return foundFileType ? foundFileType.type : 'unknown'
}

module.exports = {
  getFileType,
}
