module.exports = {
  ...require('./stripComments'),
  ...require('./resolveFileType'),
  ...require('./loadRepoContent'),
  ...require('./getTestReportHtml'),
}
