const { addEnv } = require('./addEnv')
const { noOpObj } = require('@keg-hub/jsutils')

/**
 * Adds the default playwright ENVs to the current process
 * Uses the passed in params and browser to set the values
 * Automatically adds to the current process
 * 
 * @param {Object} env - Object that holds the Envs
 * @param {string} browser - Name of the browser the ENVs relate to
 * @param {Object} params - Options passed from the task parsed into an Object with args-parse
 * 
 * @returns {Object} - env object with the ENVs added
 */
const buildPWEnvs = (env={}, browser, params=noOpObj) => {
  const { HERKIN_RUN_FROM_UI } = process.env

  // Check if running form the UI and set the display as well as spec result logging
  if(HERKIN_RUN_FROM_UI){
    addEnv(env, 'DISPLAY', ':0.0')
    addEnv(env, 'PARKIN_LOG_JEST_SPEC', 1)
  }

  // Playwright browser ENVs
  addEnv(env, 'HERKIN_BROWSER', browser)
  addEnv(env, 'HERKIN_SLOW_MO', params.slowMo)
  addEnv(env, 'HERKIN_HEADLESS', params.headless)
  addEnv(env, 'HERKIN_BROWSER_TIMEOUT', params.browserTimeout)
  addEnv(env, 'HERKIN_BROWSER_DEVICES', params.devices, JSON.stringify(params.devices))

  // Playwright Context ENVs
  addEnv(env, 'HERKIN_CONTEXT_TZ', params.timezone)
  addEnv(env, 'HERKIN_CONTEXT_WIDTH', params.width)
  addEnv(env, 'HERKIN_CONTEXT_HEIGHT', params.height)
  addEnv(env, 'HERKIN_CONTEXT_RECORD', params.record)
  addEnv(env, 'HERKIN_CONTEXT_TOUCH', params.hasTouch)
  addEnv(env, 'HERKIN_CONTEXT_MOBILE', params.isMobile)
  addEnv(env, 'HERKIN_CONTEXT_DOWNLOADS', params.downloads)
  addEnv(env, 'HERKIN_CONTEXT_GEO', params.geolocation, JSON.stringify(params.geolocation))
  addEnv(env, 'HERKIN_CONTEXT_PERMISSIONS', params.permissions, JSON.stringify(params.permissions))

  
  params.debug && addEnv(env, 'DEBUG', 'pw:api')
  params.debug &&
  params.devtools &&
  addEnv(env, 'HERKIN_DEV_TOOLS', params.devtools)
  
  env.NODE_ENV = `test`

  return env
}

module.exports = {
  buildPWEnvs
}