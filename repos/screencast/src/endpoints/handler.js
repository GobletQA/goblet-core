const { isObj } = require(`@keg-hub/jsutils`)
const { Logger } = require(`@keg-hub/cli-utils`)

const logError = (error) => Logger.error(error)

const handleApiErr = (req, res, err, status) => {
  const error = {
    message: isObj(err) ? err.message : err || `An api error occurred!`
  }
  res.statusCode = status || 400
  logError(err.stack || err.message)

  return res.json({
    status: res.statusCode,
    error: error 
  })
}

const handleApiResponse = (req, res, data, status) => {
  res.statusCode = status || 200

  return res.json({
    data,
    status: res.statusCode,
  })
}


module.exports = {
  apiErr: handleApiErr,
  apiResponse: handleApiResponse,
}