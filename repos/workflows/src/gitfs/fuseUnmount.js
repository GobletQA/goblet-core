const fs = require('fs')
const { runCmd, Logger } = require('@keg-hub/cli-utils')
const { throwErr } = require('../utils/throwErr')
const { wait, limbo } = require('@keg-hub/jsutils')
const { getRepoPath } = require('../utils/getRepoPath')

/**
 * Unmounts a fuse mounted directory, then removes the directory
 * @function
 * @public
 * @throws
 *
 * @param {Object} args
 *
 * @returns {void}
 */
const fuseUnmount = async args => {
  const repoPath = getRepoPath(args)
  Logger.log(`Unmounting repo at path ${repoPath}`)

  const exitCode = await runCmd('fusermount', ['-u', repoPath])

  // Fuse sometimes takes a bit to close,
  // And will return an exit code 1, even though it actually was successful
  // So wait a few seconds, and then force remove the folder
  exitCode && wait(2000)

  // After unmounting, remove the repo directory
  Logger.log(`Removing repo directory...`)
  const [err] = await limbo(
    new Promise((res, rej) => {
      fs.rm(repoPath, { recursive: true, force: true }, err =>
        err ? rej(err) : res(true)
      )
    })
  )

  err && throwErr(err)
}

module.exports = {
  fuseUnmount,
}
