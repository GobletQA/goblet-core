module.exports = {
  ...require('./dockerCmd'),
  ...require('./buildCmdOpts'),
  ...require('./handleTestExit'),
  ...require('./ensureBrowserType'),
}