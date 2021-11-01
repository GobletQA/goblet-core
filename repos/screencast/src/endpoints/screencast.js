const { AppRouter } = require('HerkinSharedRouter')
const { parseJSON, get } = require('@keg-hub/jsutils')
const { apiErr, apiResponse } = require('./handler')
const {
  stopScreencast,
  statusScreencast,
  startScreencast,
} = require('HerkinSCScreencast')

/**
 * Parses the browser config from passed on query and app config
 * parseJSON is needed because query.browser comes in as a json string
 */
const getBrowserConf = (app, query) => {
  return {
    browser: {
      ...get(app, 'locals.config.browser', noOpObj),
      ...get(app, 'locals.config.screencast.browser', noOpObj),
      ...parseJSON(query.browser),
    }
  }
}

const scStatus = async (req, res) => {
  try {
    const { query, data, app } = req
    // TODO: Load the parkin world
    // Check if it has an app.url field
    // If it does, update the started browser to navigate to the URL
    const status = await statusScreencast({
      ...query,
      ...(query.browser && { browser: parseJSON(query.browser)})
    })
    status.lastCheck = new Date().getTime()

    return apiResponse(req, res, status, 200)
  }
  catch(err){
    return apiErr(req, res, err, 400)
  }
}

const scRestart = async (req, res) => {
  try {
    const { params } = req
  
    const killResp = await stopScreencast(params)
    const resp = await startScreencast(params)

    return apiResponse(req, res, resp, 200)
  }
  catch(err){
    return apiErr(req, res, err, 400)
  }
}

const scStart = async (req, res) => {
  try {
    const { params } = req
    const resp = await startScreencast(params)

    return apiResponse(req, res, resp, 200)
  }
  catch(err){
    return apiErr(req, res, err, 400)
  }
}

const scStop = async (req, res) => {
  try {
    const { params } = req
    const resp = await stopScreencast(params)

    return apiResponse(req, res, resp, 200)
  }
  catch(err){
    return apiErr(req, res, err, 400)
  }
}

module.exports = (...args) => {
  AppRouter.get('/screencast/status', scStatus)
  AppRouter.post('/screencast/stop', scStop)
  AppRouter.post('/screencast/start', scStart)
  AppRouter.post('/screencast/restart', scRestart)
}