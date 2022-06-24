

/**
 * Create a new repo by making a post request to github's API
 * @example - User
 * curl -H "Authorization: token ACCESS_TOKEN" \
 *   --data '{"name":"NEW_REPO_NAME"}' \
 *   https://api.github.com/user/repos
 *
 * @example - Organization
 * curl -H "Authorization: token ACCESS_TOKEN" \
 * --data '{"name":"NEW_REPO_NAME"}' \
 * https://api.github.com/orgs/ORGANIZATION_NAME/repos
*/

const axios = require('axios')
const { limbo } = require('@keg-hub/jsutils')
const { Logger } = require('@keg-hub/cli-utils')
const { throwGitError, buildHeaders, buildAPIUrl } = require('./gitUtils')

/**
 * TODO - Creates a new repo by calling github's API via axios
 */
const createRepo = async ({ remote, token, log }, repoName) => {
  const remoteUrl = buildAPIUrl(remote)

  const params = {
    method: 'POST',
    url: remoteUrl,
    data: { repoName },
    headers: buildHeaders(token),
  }

  log && Logger.log(`Create Repo Request Params:\n`, params)

  const [err] = await limbo(axios(params))

  err &&
    throwGitError(
      err,
      remoteUrl,
      `[WRK-FL BRANCH] Github API error while getting creating repo ${branch} sha`
    )

  return newBranch
}

module.exports = {
  createRepo
}