module.exports = {
  ...require('./stripComments'),
  ...require('./loadRepoContent'),
  ...require('./getTestReportHtml'),
}
