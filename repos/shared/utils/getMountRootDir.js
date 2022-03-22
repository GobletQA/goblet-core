const path = require('path')
const { HERKIN_MOUNT_ROOT = `/keg/repos` } = process.env

/**
 * Gets the mount root directory
 * Normalizes it, so all references to it are consistent
 */
const getMountRootDir = () => {
  return path.resolve(HERKIN_MOUNT_ROOT)
}

module.exports = {
  getMountRootDir,
}
