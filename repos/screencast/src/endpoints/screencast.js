const { parseJSON } = require('@keg-hub/jsutils')
const { AppRouter } = require('@GSH/Router')
const { asyncWrap, apiRes } = require('@GSH/Exp')
const {
  stopScreencast,
  startScreencast,
  statusScreencast,
} = require('@GSC/Screencast')

/**
 * Endpoint to get the current status  of the browser
 */
const scStatus = asyncWrap(async (req, res) => {
  const { query } = req
  const status = await statusScreencast({
    ...query,
    ...(query.browser && { browser: parseJSON(query.browser) }),
  })
  status.lastCheck = new Date().getTime()

  return apiRes(req, res, status, 200)
})

/**
 * Endpoint to restart browser or start the browser if not running
 */
const scRestart = asyncWrap(async (req, res) => {
  const { params } = req

  await stopScreencast(params)
  const status = await startScreencast(params)

  return apiRes(req, res, status, 200)
})

/**
 * Endpoint to start browser if it's not running
 */
const scStart = asyncWrap(async (req, res) => {
  const { params } = req
  const status = await startScreencast(params)

  return apiRes(req, res, status, 200)
})

/**
 * Endpoint to stop browser if it's running
 */
const scStop = asyncWrap(async (req, res) => {
  const { params } = req
  const status = await stopScreencast(params)

  return apiRes(req, res, status, 200)
})

module.exports = (...args) => {
  AppRouter.get('/screencast/status', scStatus)
  AppRouter.post('/screencast/stop', scStop)
  AppRouter.post('/screencast/start', scStart)
  AppRouter.post('/screencast/restart', scRestart)
}
