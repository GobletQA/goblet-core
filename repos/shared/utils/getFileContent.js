const { pathExists, readFile } = require('@GSH/FileSys/fileSys')

/**
 * Gets the text content of a file from the passed in location
 * If the file does not exist, it returns undefined
 *
 * @param {string} location - Path to the file to be loaded
 *
 * @returns {string} - Loaded text content of the file found at the passed in location
 */
const getFileContent = async location => {
  const [err, exists] = await pathExists(location)
  if (!exists || err) return undefined

  const [__, content] = await readFile(location)
  return content
}

module.exports = {
  getFileContent,
}
