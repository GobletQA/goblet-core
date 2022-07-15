const { AppRouter } = require('@GSH/Router')
const { noOpObj } = require('@keg-hub/jsutils')
const { asyncWrap, apiRes } = require('@GSH/Exp')
const { joinBrowserConf } = require('@GSH/Utils/joinBrowserConf')
const {
  stopBrowser,
  startBrowser,
  actionBrowser,
  statusBrowser,
  restartBrowser,
} = require('@GSC/Playwright')

/**
 * Starts a Playwright Browser using the passed in params as launch options
 * @param {Object} req.params
 * @param {string} params.type - The browser type to start [chromium|firefox]
 *
 */
const browserStart = asyncWrap(async (req, res) => {
  const { query } = req
  const { status } = await startBrowser(joinBrowserConf(query))

  return apiRes(req, res, status, 200)
})

/**
 * Gets the current status of the browser
 *
 */
const browserStatus = asyncWrap(async (req, res) => {
  const { query } = req
  const { status } = await statusBrowser(joinBrowserConf(query))

  return apiRes(req, res, status, 200)
})

/**
 * Restarts a Browser by killing it, and starting it
 *
 */
const browserRestart = asyncWrap(async (req, res) => {
  const { params } = req
  const { status } = await restartBrowser(joinBrowserConf(params))

  return apiRes(req, res, status, 200)
})

/**
 * Stops a Browser if its running
 *
 */
const browserStop = asyncWrap(async (req, res) => {
  const { params } = req
  const status = await stopBrowser(joinBrowserConf(params))

  return apiRes(req, res, status, 200)
})

/**
 * Execute an action on a playwright component ( browser, context, page )
 *
 */
const browserAction = asyncWrap(async (req, res) => {
  const { body } = req
  const { ref, actions, ...browser } = body
  const browserConf = joinBrowserConf(browser)

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
