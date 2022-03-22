const { throwErr } = require('./throwErr')
const { limbo } = require('@keg-hub/jsutils')
const { runCmd } = require('@keg-hub/cli-utils')

/**
 * Copies content from one location to another
 * @param {string} src - Source location to copy from
 * @param {string} dest - Final location to copy to
 *
 * @returns {boolean} - True if the copy method does not throw
 */
const copyContent = async ({ src, dest }) => {
  const [err, { error, data, exitCode }] = await limbo(
    runCmd('cp', ['-R', src, dest], { exec: true })
  )

  return error ? throwErr(error) : true
}

module.exports = {
  copyContent,
}
