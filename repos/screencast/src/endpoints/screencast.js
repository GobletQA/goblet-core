const { parseJSON } = require('@keg-hub/jsutils')
const { AppRouter } = require('HerkinSharedRouter')
const { asyncWrap, apiRes } = require('HerkinSharedExp')
const {
  stopScreencast,
  statusScreencast,
  startScreencast,
} = require('HerkinSCScreencast')

const scStatus = asyncWrap(async (req, res) => {
  const { query } = req
  const status = await statusScreencast({
    ...query,
    ...(query.browser && { browser: parseJSON(query.browser) }),
  })
  status.lastCheck = new Date().getTime()

  return apiRes(req, res, status, 200)
})

const scRestart = asyncWrap(async (req, res) => {
  const { params } = req

  await stopScreencast(params)
  const status = await startScreencast(params)

  return apiRes(req, res, status, 200)
})

const scStart = asyncWrap(async (req, res) => {
  const { params } = req
  const status = await startScreencast(params)

  return apiRes(req, res, status, 200)
})

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
