const { AppRouter } = require('HerkinSharedRouter')
const { get, noOpObj } = require('@keg-hub/jsutils')
const { asyncWrap, apiRes } = require('HerkinSharedExp')
const {
  actionBrowser,
  stopBrowser,
  startBrowser,
  statusBrowser,
  restartBrowser,
} = require('HerkinSCPlaywright')

/**
 * Builds a browser config merging the passed in params and global config.browser settings
 * @param {Object} options - Options for interfacing with Playwright Browser object
 * @param {Object} app - Express Server Application
 *
 * @return {Object} - Browser config object
 */
const joinConf = (options, app) => {
  return {
    ...get(app, 'locals.config.browser', noOpObj),
    ...get(app, 'locals.config.screencast.browser', noOpObj),
    ...options,
  }
}

/**
 * Starts a Playwright Browser using the passed in params as launch options
 * @param {Object} req.params
 * @param {string} params.type - The browser type to start [chromium|firefox]
 *
 */
const browserStart = asyncWrap(async (req, res) => {
  const { query, app } = req
  const browserConf = joinConf(query, app)
  const { browser, context, page } = await startBrowser(browserConf)
  const status = await statusBrowser(browserConf, browser, context, page)

  return apiRes(req, res, status, 200)
})

/**
 * Gets the current status of the browser
 *
 */
const browserStatus = asyncWrap(async (req, res) => {
  const { query, app } = req
  const status = await statusBrowser(joinConf(query, app))

  return apiRes(req, res, status, 200)
})

/**
 * Restarts a Browser by killing it, and starting it
 *
 */
const browserRestart = asyncWrap(async (req, res) => {
  const { params, app } = req
  const browserConf = joinConf(params, app)
  const { browser, context, page } = await restartBrowser(browserConf)
  const status = await statusBrowser(browserConf, browser, context, page)

  return apiRes(req, res, status, 200)
})

/**
 * Stops a Browser if its running
 *
 */
const browserStop = asyncWrap(async (req, res) => {
  const { params, app } = req
  const browserConf = joinConf(params, app)
  const status = await stopBrowser(browserConf)

  return apiRes(req, res, status, 200)
})

/**
 * Execute an action on a playwright component ( browser, context, page )
 *
 */
const browserAction = asyncWrap(async (req, res) => {
  const { body, app } = req
  const { ref, actions, ...browser } = body
  const browserConf = joinConf(browser, app)

  await actionBrowser({ ref, actions, id: req.user.userId }, browserConf)

  return apiRes(req, res, noOpObj, 200)
})

module.exports = () => {
  AppRouter.get('/screencast/browser/start', browserStart)
  AppRouter.get('/screencast/browser/status', browserStatus)
  AppRouter.post('/screencast/browser/stop', browserStop)
  AppRouter.post('/screencast/browser/action', browserAction)
  AppRouter.post('/screencast/browser/restart', browserRestart)
}
