const { asyncWrap, apiRes } = require('@gobletqa/shared/express')

/**
 * Responds with the parkin report html as string
 */
const listReports = asyncWrap(async (req, res) => {
  // TODO: add list of all current reports based on fileType
  return apiRes(req, res, { success: true } || {}, 200)
})

module.exports = {
  listReports,
}
