const path = require('path')
const { GB_SH_MOUNT_ROOT = `/keg/repos` } = process.env

/**
 * Gets the mount root directory
 * Normalizes it, so all references to it are consistent
 */
const getMountRootDir = () => {
  return path.resolve(GB_SH_MOUNT_ROOT)
}

module.exports = {
  getMountRootDir,
}
