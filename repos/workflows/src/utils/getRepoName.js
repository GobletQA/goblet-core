/**
 * Gets the name of the repo from the remote url
 * Uses the last part of the pathname to extract repo name
 * Also removes .git if it exists
 * @param {string} remote - Git remote url
 *
 * @returns {string} - Name of the repo
 */
const getRepoName = remote => {
  const url = new URL(remote)
  return url.pathname.split('/').pop().replace('.git', '')
}

module.exports = {
  getRepoName,
}
