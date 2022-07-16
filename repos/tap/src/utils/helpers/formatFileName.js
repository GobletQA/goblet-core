

/**
 * Helper to add the file location back if it exists
 * @param {string} name - Name of the file
 * @param {string} location - Folder path location of the file
 * 
* @returns {string} - File name with the location added
 */
const addLocation = (name, location) => {
  return location ? `${location}/${name}` : name
}


/**
 * Formats a string input into a valid file name
 * @function
 * @param {string} input - The input to be formatted into a valid file name
 *
 * @returns {string} - Formatted input as a valid file name
 */
export const formatFileName = (input, fileMeta) => {
  if(!input) return input

  const cleaned = input.replace(/(^|[\s\\:\*\?'"<>;,`*()\|+$])/g, '')
  if(!fileMeta || !fileMeta.ext) return cleaned

  const locSplit = cleaned.split(`/`)
  const cleanName = locSplit.pop()
  const location = locSplit.join(`/`)

  const [name, nameType] = cleanName.split(`.`)
  const { ext, type, typeInName } = fileMeta

  return !typeInName
    ? addLocation(`${name}.${ext}`, location)
    // If the type comes first, and the nameType is actually the name
    // And not the ext, then rebuild and return
    // i.e. waypoint.file-name.js
    : name === type && (nameType && nameType !== ext)
      ? addLocation(`${name}.${nameType}.${ext}`, location)
      : addLocation(`${name}.${type}.${ext}`, location) 
}
