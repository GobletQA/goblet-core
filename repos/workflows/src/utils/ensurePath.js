const path = require('path')
const { fileSys } = require('@keg-hub/cli-utils')
const { pathExists, mkDir } = fileSys

/**
 * Ensures a path exists on the host machine
 * @throws
 * @function
 * @param {string} location - Path to ensure exists
 *
 * @returns {boolean} - True if the path exists
 */
const ensurePath = async location => {
  const [err, exists] = await pathExists(location)

  if (err && err.code !== `ENOENT`) throw new Error(err)
  if (exists) return true

  const [mkErr, success] = await mkDir(location)
  if (mkErr) throw new Error(mkErr)

  return success
}

module.exports = {
  ensurePath,
}
