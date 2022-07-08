const { asyncWrap } = require('GobletSharedExp')
const { htmlRes, htmlErr } = require('GobletBackEndpoints/handlers')
const { getTestReportHtml } = require('GobletBackUtils/getTestReportHtml')
const { loadTemplate } = require(`GobletSharedTemplate/loadTemplate`)

/**
 * Loads reports from the passed in params
 */
const loadReport = asyncWrap(async (req, res) => {
  // Load the default 404 page for non-existing reports
  const report404 = await loadTemplate('reports404')

  // Get the path to the report from the non-parsed url param
  const reportPath = req.params['0']
  // Ensure the reportPath exists
  if (!reportPath) throw new Error(report404)

  // Load the report html
  const reportHtml = await getTestReportHtml(reportPath)
  // If no report html could be loaded, then throw
  if (!reportHtml) throw new Error(report404)

  // Resolve with the report html
  return htmlRes(req, res, reportHtml)
}, htmlErr)

module.exports = {
  loadReport,
}
