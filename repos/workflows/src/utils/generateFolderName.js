const path = require('path')
/**
 * Generates a path safe username from the passed in name or user object
 * @function
 * @private
 *
 * @param {string} name - Name of the user
 * @param {Objet} user - User object model
 * @param {Objet} repo - Repo object model
 *
 * @returns {string} - Formatted user name
 */
const generateFolderName = (user, repo) => {
  let folderName =
    user.username ||
    user.gitUser ||
    (repo && repo.local && path.basename(repo.local)) ||
    (user.firstName &&
      user.lastName &&
      `${user.firstName}-${user.lastName}`.toLowerCase()) ||
    (repo && repo.url && new URL(repo.url).pathname.split('/')[1])

  return folderName && folderName.toLowerCase().replace(/[^a-zA-Z0-9]/g, '')
}

module.exports = {
  generateFolderName,
}
