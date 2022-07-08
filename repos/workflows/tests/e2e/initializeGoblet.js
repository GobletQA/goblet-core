const path = require('path')
const { wait } = require('@keg-hub/jsutils')
const { fileSys, Logger } = require('@keg-hub/cli-utils')
const { parkinRepo, adminUser } = require('../../__mocks__')
const { isRepoMounted } = require('../../src/gitfs/isRepoMounted')
const { initializeGoblet } = require('../../src/goblet/initializeGoblet')
const { disconnectGoblet } = require('../../src/goblet/disconnectGoblet')

const { readFile } = fileSys
const { GOBLET_GIT_TOKEN } = process.env

let gitToken
const loadToken = async () => {
  if (GOBLET_GIT_TOKEN) return (gitToken = GOBLET_GIT_TOKEN)

  const tokenFile = path.join(__dirname, `../../__mocks__/.token`)
  try {
    const [err, token] = await readFile(tokenFile)
    if (!token.trim()) throw new Error(`Missing token in ${tokenFile}`)
    gitToken = token
    process.env.GOBLET_GIT_TOKEN = gitToken
  } catch (err) {
    Logger.error(`Missing git provider token file`)
    Logger.pair(`Please create a file at`, tokenFile)
    Logger.log(`It must contain only a valid git token for the test repo`)
    process.exit(1)
  }
}

module.exports = (async () => {
  Logger.log(`Loading token...`)
  await loadToken()
  Logger.log(`Initializing repo...`)

  const args = {
    repo: parkinRepo,
    user: adminUser,
    token: gitToken,
  }

  /** Run the initialize goblet repo */
  await initializeGoblet(args)

  // Wait 5 seconds
  Logger.log(`Waiting 5 seconds to unmount...`)
  await wait(1000)
  Logger.log(`4 seconds...`)
  await wait(1000)
  Logger.log(`3 seconds...`)
  await wait(1000)
  Logger.log(`2 seconds...`)
  await wait(1000)
  Logger.log(`1 seconds...`)
  await wait(1000)

  /** Validate it was mounted after initialize workflow */
  const beforeUnmount = await isRepoMounted(args)
  if (!beforeUnmount) {
    Logger.error(`[ ERROR ] Repo is not mounted`)
    process.exit(1)
  }

  /** Run the disconnect goblet repo */
  await disconnectGoblet(args)

  Logger.log(`Waiting 3 seconds to disconnect...`)
  await wait(3000)

  /** Validate it was unmounts after disconnect workflow */
  const after = await isRepoMounted(args)

  if (!after)
    return Logger.success(
      `\ninitializeGoblet and disconnectGoblet E2E test successful\n`
    )

  Logger.error(`[ ERROR ] Repo could not be unmounted`)
  process.exit(1)
})()
