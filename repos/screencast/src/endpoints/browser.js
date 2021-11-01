const { AppRouter } = require('HerkinSharedRouter')
const { get, noOpObj } = require('@keg-hub/jsutils')
const { apiErr, apiResponse } = require('./handler')
const {
  stopBrowser,
  startBrowser,
  statusBrowser,
  restartBrowser,
} = require('HerkinSCPlaywright')

/**
 * Starts a Playwright Browser using the passed in params as launch options
 * @param {Object} options - Options for interfacing with Playwright Browser object
 * @param {Object} app - Express Server Application
 *
 * @return {Object} - Browser config object
 */
const joinConf = (options, app) => {
  return {
    ...get(app, 'locals.config.browser', noOpObj),
    ...get(app, 'locals.config.screencast.browser', noOpObj),
    ...options
  }
}

/**
 * Starts a Playwright Browser using the passed in params as launch options
 * @param {Object} req.params
 * @param {string} params.type - The browser type to start [chromium|firefox]
 *
 */
const browserStart = async (req, res) => {
  try {
    const { query, app } = req
    const browserConf = joinConf(query, app)
    const { browser, context, page } = await startBrowser(browserConf)
    const status = await statusBrowser(browserConf, browser, context, page) 

    return apiResponse(req, res, status, 200)
  }
  catch(err){
    return apiErr(req, res, err, 400)
  }
}

/**
 * Gets the current status of the browser
 *
 */
const browserStatus = async (req, res) => {
  try {
    const { query, app } = req
    const status = await statusBrowser(joinConf(query, app))

    return apiResponse(req, res, status, 200)
  }
  catch(err){
    return apiErr(req, res, err, 400)
  }
}

/**
 * Restarts a Browser by killing it, and starting it
 *
 */
const browserRestart = async (req, res) => {
  try {
    const { params, app } = req
    const browserConf = joinConf(params, app)
    const { browser, context, page } = await restartBrowser(browserConf)
    const status = await statusBrowser(browserConf, browser, context, page) 

    return apiResponse(req, res, status, 200)
  }
  catch(err){
    return apiErr(req, res, err, 400)
  }
}

/**
 * Stops a Browser if its running
 *
 */
const browserStop = async (req, res) => {
  try {
    const { params, app } = req
    const browserConf = joinConf(params, app)
    const status = await stopBrowser(browserConf)

    return apiResponse(req, res, status, 200)
  }
  catch(err){
    return apiErr(req, res, err, 400)
  }
}

module.exports = () => {
  AppRouter.get('/screencast/browser/start', browserStart)
  AppRouter.get('/screencast/browser/status', browserStatus)
  AppRouter.post('/screencast/browser/stop', browserStop)
  AppRouter.post('/screencast/browser/restart', browserRestart)
}