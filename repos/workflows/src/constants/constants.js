const path = require('path')
const { GRAPH } = require('./graph')
const { deepFreeze } = require('@keg-hub/jsutils')
const { getMountRootDir } = require('@GSH/Utils/getMountRootDir')
const { GB_SH_LOCAL_MOUNT = 'goblet-local/current' } = process.env

const mountRootDir = getMountRootDir()

/**
 * Constants for running the workflows with consistent values
 * Frozen so the values can not be changed
 * @readonly
 */
module.exports = deepFreeze({
  GRAPH,
  MOUNT_ROOT: mountRootDir,
  LOCAL_MOUNT: path.join(mountRootDir, GB_SH_LOCAL_MOUNT),
  MOUNT_LOG: path.join(`/var/log/gitfs.log`),
  EMPTY_VOL_MOUNT: `.goblet-empty-status.js`,
})
