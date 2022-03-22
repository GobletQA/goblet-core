const { docker } = require('@keg-hub/cli-utils')

/**
 * Copy content from a docker container to the host machine
 * @param {string} local - Local location to copy the content to
 * @param {string} remote - Remote location to copy the content from
 * @param {string} container - Container name or ref id to copy the content form
 */
const copyFromContainer = async ({ local, remote, container }) => {
  await docker([`cp`, `${container}:${remote}`, local])
}

module.exports = {
  copyFromContainer
}