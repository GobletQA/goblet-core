module.exports = {
  ...require('./getOS'),
  ...require('./inDocker'),
  ...require('./flatUnion'),
  ...require('./vncActiveEnv'),
}