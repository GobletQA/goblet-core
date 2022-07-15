const path = require('path')
const { exists } = require('@keg-hub/jsutils')
const { containerDir } = require('../../paths')
const { addToProcess } = require('@keg-hub/cli-utils')
const { setVncENV } = require('@GSC/Libs/utils/vncActiveEnv')

// TODO: Setup custom ENVs to pull from the values files
const vncEnvs = {
  // Add custom envs for the VNC environment
}

const mountEnvs = {
  // Add custom envs for the local environment
}

/**
 * Sets the mode that goblet will be run in
 * Then calls methods to set the proper envs
 * @param {Object} params - Task options converted into an object
 * @param {Object} params.launch - Option to run the local browser
 * @param {Object} params.mode - Mode goblet should be run in
 *
 * @returns {string} - Mode that goblet is running in
 */
const setGobletMode = params => {
  const { launch, local, vnc } = params

  const mode = params.mode || (vnc && 'vnc') || (local && 'local') || undefined
  // const gobletMode = exists(mode) ? mode : launch ? 'local' : 'vnc'
  const gobletMode = exists(mode)
    ? mode
    : !exists(launch) || launch
    ? 'local'
    : 'vnc'
  const vncActive = gobletMode === 'vnc' ? true : false

  setVncENV(vncActive)
  addToProcess(
    {
      ...(vncActive ? vncEnvs : mountEnvs),
      KEG_COMPOSE_GOBLET: path.join(
        containerDir,
        `docker-compose-${gobletMode}.yml`
      ),
    },
    { force: true }
  )

  return gobletMode
}

module.exports = {
  setGobletMode,
}
