const { isObj } = require(`@keg-hub/jsutils`)
const { Logger } = require(`@keg-hub/cli-utils`)

const apiErr = (err, status, req, res) => {
  const error = {
    message: isObj(err) ? err.message : err || `An api error occurred!`,
  }
  Logger.error(err.stack || err.message)

  if(res.headersSent) return 

  res.statusCode = err.statusCode || status || 400
  res.json(error)
}

module.exports = {
  apiErr,
}
