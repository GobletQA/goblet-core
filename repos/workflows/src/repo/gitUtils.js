
/**
 * TODO set this ENV in the config => GIT_REPO_HOST
 */

const path = require('path')
const url = require('url')
const { Logger } = require('@keg-hub/cli-utils')
const { throwErr } = require('../utils/throwErr')

/**
 * Throws an error when a git workflow fails
 * If a message is passed the message is also loged
 *
 * @returns {void}
 */
const throwGitError = (err, remoteUrl='Unknown', message) => {
  message && Logger.error(message)
  console.error(err.stack)
  Logger.empty()

  throwErr(`Error when calling git API - ${remoteUrl}`)
}

/**
 * Builds the request headers for calling github Api V3
 * Adds the Authorization header when the token exists
 *
 * @returns {Object} - Request header object
 */
const buildHeaders = token => ({
  ...(token && { Authorization: `token ${token}` }),
  'Content-Type': 'application/json',
  Accept: `application/vnd.github.v3+json`,
})

/**
 * Builds a github api url based on the passed in remote
 */
const buildAPIUrl = (remote, pathExt=[]) => {
  const repoUrl = new url.URL(remote)
  repoUrl.host = process.env.GIT_REPO_HOST || 'api.github.com'
  repoUrl.pathname = path.join(`repos`, repoUrl.pathname, ...pathExt)

  return repoUrl.toString()
}

module.exports = {
  buildAPIUrl,
  buildHeaders,
  throwGitError
}
