const path = require('path')
const { MOUNT_ROOT } = require('../constants')
const { noOpObj } = require('@keg-hub/jsutils')
const { generateFolderName } = require('./generateFolderName')

/**
 * Gets the path to a repo location based on passed in params
 * @function
 * @public
 * @throws
 *
 * @param {Object} args
 *
 * @returns {string} - Path to the mounted repo
 */
const getRepoPath = (args = noOpObj) => {
  const { user = noOpObj, repo = noOpObj } = args

  const folderName = generateFolderName(user, repo)
  if (folderName) return path.join(MOUNT_ROOT, folderName)

  throw new Error(`A user name is required generate a repo path`)
}

module.exports = {
  getRepoPath,
}
