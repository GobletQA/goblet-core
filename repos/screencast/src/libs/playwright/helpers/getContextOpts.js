const { getGobletConfig } = require('GobletSharedConfig')
const { noOpObj, deepMerge } = require('@keg-hub/jsutils')
const { taskEnvToContextOpts } = require('GobletSharedUtils/taskEnvToContextOpts')

/**
 * Builds the config for a Playwright browser context
 * @param {Object} contextOpts - Playwright browser context config
 * @param {Object} herkin - Global herkin config object
 *
 * @returns {Object} - Built context config
 */
const getContextOpts = (contextOpts=noOpObj, herkin) => {
  herkin = herkin || getGobletConfig()
  return deepMerge(
    /**
     * The default config options from the global herkin.config.js
     */
    herkin?.screencast?.context,
    /**
     * Options passed to this function as the first argument
     * Should override all except for options set by a task via ENVs
     */
    contextOpts,
    /**
     * Task env opts overrides all others
     * These come from the options passed to a task that started the process
     * This ensures those options gets set
     */
    taskEnvToContextOpts(herkin)
  )
}

module.exports = {
  getContextOpts,
}
