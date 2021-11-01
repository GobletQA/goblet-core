const { AppRouter } = require('HerkinSharedRouter')
const { apiErr, apiResponse } = require('./handler')
const {
  startSockify,
  stopSockify,
  startVNC,
  stopVNC,
} = require('HerkinSCVnc')

const vncStatus = () => {
  try {
    const { params } = req
  
    return apiResponse(req, res, {}, 200)
  }
  catch(err){
    return apiErr(req, res, err, 400)
  }
}

const vncStart = () => {
  try {
    const { params } = req
  
    return apiResponse(req, res, {}, 200)
  }
  catch(err){
    return apiErr(req, res, err, 400)
  }
}

const vncStop = () => {
  try {
    const { params } = req
  
    return apiResponse(req, res, {}, 200)
  }
  catch(err){
    return apiErr(req, res, err, 400)
  }
}

const vncRestart = () => {
  try {
    const { params } = req
  
    return apiResponse(req, res, {}, 200)
  }
  catch(err){
    return apiErr(req, res, err, 400)
  }
}


module.exports = (...args) => {
  AppRouter.get('/screencast/vnc/status', vncStatus)
  AppRouter.post('/screencast/vnc/start', vncStart)
  AppRouter.post('/screencast/vnc/stop', vncStop)
  AppRouter.post('/screencast/vnc/restart', vncRestart)
}