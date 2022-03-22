
/**
 * Validates a new does not already exist
 * If it does, then add a sub-folder, and recursively re-validate the name
 * @param {string} name - Name of the file to validate
 * @param {Array<string>} split - Full file path split at /
 * @param {Array<string>} existing - Files that had already been added to the group
 */
 const validateName = (name, split, existing) => {
  return !split.length || !existing.includes(name)
    ? name
    : validateName(`${split.pop()}/${name}`, split, existing)
}

/**
 * Gets the display name of the passed in object
 * Checks if it's an index file and is so, includes the fileType
 *
 * @param {string} location - Path to a file
 * @param {Array<string>} existing - Files that had already been added to the group
 *
 * @return {string} - Display name of the object
 */
export const getFileName = (location, existing) => {
  const split = location.split('/')
  const name = Array.from([
    split.pop(),
    split.pop(),
    split.pop(),
  ])
  .reverse()
  .filter(part => part)
  .join('/')

  return existing ? validateName(name, split, existing) : name
}
