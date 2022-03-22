module.exports = {
  ...require('./repo'),
  ...require('./definitions'),
  ...require('./features'),
  herkinFiles: require('./fileSys/herkinFiles'),
}
