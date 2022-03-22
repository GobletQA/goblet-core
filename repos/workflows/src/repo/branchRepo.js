/**
 * 1. Find the revision you want to branch from
 *  https://api.github.com/repos/<AUTHOR>/<REPO>/git/refs/heads
 * 2. Pull the revision hash from the response
 * 3. Then does a POST request to github API
 *  * URL: https://api.github.com/repos/<AUTHOR>/<REPO>/git/refs
 *  * Data: { ref: `refs/heads/${newBranch}`, sha: <hash-from-step-2> }
 */

const path = require('path')
const url = require('url')
const axios = require('axios')
const { limbo } = require('@keg-hub/jsutils')
const { Logger } = require('@keg-hub/cli-utils')
const { throwErr } = require('../utils/throwErr')
const { buildHeaders } = require('../utils/buildHeaders')

const throwBranchError = (err, remoteUrl, message) => {
  message && Logger.error(message)
  console.error(err.stack)
  Logger.empty()

  throwErr(`Error creating git branch from remote ${remoteUrl}`)
}

const buildAPIUrl = remote => {
  const repoUrl = new url.URL(remote)
  repoUrl.host = 'api.github.com'
  repoUrl.pathname = path.join(`repos`, repoUrl.pathname, `git/refs`)

  return repoUrl.toString()
}

const getBranchHash = async ({ branch, remote, token, log }) => {
  const remoteUrl = buildAPIUrl(remote)
  const params = {
    method: 'GET',
    url: `${remoteUrl}/heads/${branch}`,
    headers: buildHeaders(token),
  }

  log && Logger.log(`Get Repo SHA Request Params:\n`, params)

  const [err, resp] = await limbo(axios(params))

  err &&
    throwBranchError(
      err,
      remoteUrl,
      `[WRK-FL BRANCH] Github API error while getting branch ${branch} sha`
    )

  return (
    resp?.data?.object?.sha ||
    throwBranchError(
      new Error(resp?.data),
      remoteUrl,
      `[WRK-FL BRANCH] Branch sha does not exist in Github API response`
    )
  )
}

const createNewBranch = async ({ branch, remote, token, log }, hash) => {
  const remoteUrl = buildAPIUrl(remote)
  const newBranch = `${branch}-herkin-${new Date().getTime()}`

  const params = {
    method: 'POST',
    url: remoteUrl,
    headers: buildHeaders(token),
    data: {
      ref: `refs/heads/${newBranch}`,
      sha: hash,
    },
  }

  log && Logger.log(`Create Branch Request Params:\n`, params)

  const [err] = await limbo(axios(params))

  err &&
    throwBranchError(
      err,
      remoteUrl,
      `[WRK-FL BRANCH] Github API error while getting branch ${branch} sha`
    )

  return newBranch
}

/**
 * Workflow for creating a new branch within a git repo from the default branch
 * @function
 * @public
 * @throws
 * See this gist for more info => https://gist.github.com/potherca/3964930
 * @param {Object} args - Data needed to execute the workflow
 * @param {Object} args.repo - Repo metadata for setting up keg-herkin
 *
 * @returns {string} - Name of the newly created branch
 */
const branchRepo = async gitArgs => {
  const hash = await getBranchHash(gitArgs)

  return await createNewBranch(gitArgs, hash)
}

module.exports = {
  branchRepo,
}
