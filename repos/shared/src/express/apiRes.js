/**
 * Api response helper called by all json api endpoints
 * Ensures the status code is set
 * Ensures consistent response object is returned
 *
 */
const apiRes = (req, res, data, status) => {
  res.statusCode = status || 200

  return res.json(data)
}

module.exports = {
  apiRes,
}
