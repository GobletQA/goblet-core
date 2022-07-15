const { AppRouter } = require('@GSH/Router')
const { asyncWrap, apiRes } = require('@GSH/Exp')
const {
  statusSockify,
  startSockify,
  stopSockify,
  statusVNC,
  startVNC,
  stopVNC,
} = require('@GSC/Libs/vnc')

const vncStatus = asyncWrap(async (req, res) => {
  const status = await statusVNC()
  return apiRes(req, res, { status }, 200)
})

const vncStart = asyncWrap(async (req, res) => {
  const status = await startVNC()
  return apiRes(req, res, { status }, 200)
})

const vncStop = asyncWrap(async (req, res) => {
  const status = await stopVNC()
  return apiRes(req, res, { status }, 200)
})

const vncRestart = asyncWrap(async (req, res) => {
  await stopVNC()
  const status = await startVNC()
  return apiRes(req, res, { status }, 200)
})

module.exports = (...args) => {
  AppRouter.get('/screencast/vnc/status', vncStatus)
  AppRouter.post('/screencast/vnc/start', vncStart)
  AppRouter.post('/screencast/vnc/stop', vncStop)
  AppRouter.post('/screencast/vnc/restart', vncRestart)
}
