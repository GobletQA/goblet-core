const path = require('path')
const { GRAPH } = require('./graph')
const { deepFreeze } = require('@keg-hub/jsutils')
const { getMountRootDir } = require('HerkinSharedUtils/getMountRootDir')
const { GOBLET_LOCAL_MOUNT = 'herkin-local/current' } = process.env

const mountRootDir = getMountRootDir()

/**
 * Constants for running the workflows with consistent values
 * Frozen so the values can not be changed
 * @readonly
 */
module.exports = deepFreeze({
  GRAPH,
  MOUNT_ROOT: mountRootDir,
  LOCAL_MOUNT: path.join(mountRootDir, GOBLET_LOCAL_MOUNT),
  MOUNT_LOG: path.join(`/var/log/gitfs.log`),
  EMPTY_VOL_MOUNT: `.herkin-empty-status.js`,
})
