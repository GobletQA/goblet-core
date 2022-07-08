const path = require('path')
const { setVncENV } = require('GobletSC')
const { exists } = require('@keg-hub/jsutils')
const { containerDir } = require('../../paths')
const { addToProcess } = require('@keg-hub/cli-utils')

// TODO: Setup custom ENVs to pull from the values files
const vncEnvs = {
  // Add custom envs for the VNC environment
}

const mountEnvs = {
  // Add custom envs for the local environment
}

/**
 * Sets the mode that keg-herkin will be run in
 * Then calls methods to set the proper envs
 * @param {Object} params - Task options converted into an object
 * @param {Object} params.launch - Option to run the local browser
 * @param {Object} params.mode - Mode keg-herkin should be run in
 *
 * @returns {string} - Mode that herkin is running in
 */
const setHerkinMode = params => {
  const { launch, local, vnc } = params

  const mode = params.mode || (vnc && 'vnc') || (local && 'local') || undefined
  // const herkinMode = exists(mode) ? mode : launch ? 'local' : 'vnc'
  const herkinMode = exists(mode)
    ? mode
    : !exists(launch) || launch
    ? 'local'
    : 'vnc'
  const vncActive = herkinMode === 'vnc' ? true : false

  setVncENV(vncActive)
  addToProcess(
    {
      ...(vncActive ? vncEnvs : mountEnvs),
      KEG_COMPOSE_HERKIN: path.join(
        containerDir,
        `docker-compose-${herkinMode}.yml`
      ),
    },
    { force: true }
  )

  return herkinMode
}

module.exports = {
  setHerkinMode,
}
