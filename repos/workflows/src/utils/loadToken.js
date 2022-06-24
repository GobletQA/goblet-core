const path = require('path')
const { fileSys, Logger } = require('@keg-hub/cli-utils')

const { NODE_ENV } = process.env
const { readFile, pathExists } = fileSys

const devEnvs = ['development', 'develop', 'local', 'test']

let gitToken

/**
 * Loads a git token in development environments
 * If a token is found it will be loaded in to process.env.GOBLET_GIT_TOKEN
 * then returned
 *
 * @returns {string|boolean} Git Token, or false if an error is thrown
 */
const loadToken = async ({ token }) => {
  // If a token is passed, then set it
  if (token) gitToken = token

  // If gitToken is set, set the env and return
  if (gitToken) {
    !process.env.GOBLET_GIT_TOKEN && (process.env.GOBLET_GIT_TOKEN = gitToken)

    return gitToken
  }

  if (process.env.GOBLET_GIT_TOKEN)
    return (gitToken = process.env.GOBLET_GIT_TOKEN)

  if (!devEnvs.includes(NODE_ENV)) return

  const tokenFile = path.join(__dirname, `../../__mocks__/.token`)
  try {
    const [existsErr, exists] = await pathExists(tokenFile)
    if (existsErr || !exists) return

    const [err, token] = await readFile(tokenFile)
    if (!token.trim()) throw new Error(`Missing token in ${tokenFile}`)
    gitToken = token.trim()
    process.env.GOBLET_GIT_TOKEN = gitToken

    return process.env.GOBLET_GIT_TOKEN
  } catch (err) {
    Logger.error(`[ ERROR ] Could not load git token file`)
    Logger.log(err.message)

    Logger.info(`\nWhen running in a dev environment`)
    Logger.pair(`Please create a file at`, tokenFile)
    Logger.log(`It must contain only a valid git token for the test repo\n`)

    return false
  }
}

module.exports = {
  loadToken,
}
