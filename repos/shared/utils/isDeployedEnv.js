const { exists } = require('@keg-hub/jsutils')

/**
 * Node Environments that Keg-Herkin can be deployed in
 */
const deployedEnvs = ['st', 'staging', 'qa', 'prod', 'production']

/**
 * Get the value for deployed Keg-Herkin environment
 */
const isDeployedEnv =
  deployedEnvs.includes(process.env.NODE_ENV) ||
  exists(process.env.KEG_GOBLET_DEPLOYED)

module.exports = {
  isDeployedEnv,
}
