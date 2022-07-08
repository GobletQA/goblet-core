module.exports = {
  ...require('./ensureBrowserType'),
  ...require('./handleTestExit'),
  ...require('./runCommands'),
  ...require('./setGobletMode'),
}
