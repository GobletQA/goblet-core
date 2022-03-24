const { appRoot } = require('../../paths')
const { runCmd } = require('@keg-hub/cli-utils')
const { loadEnvs }  = require('../envs/loadEnvs')


/**
 * Logs into the azure container register
 */
const login = async ({ env }) => {
  const envs = loadEnvs({env})
  const { AZ_CONTAINER_REGISTRY } = envs
  // Tag the docker image to be pushed to google
  return await runCmd(`az`, [
    `acr`,
    `login`,
    `--name`,
    AZ_CONTAINER_REGISTRY
  ], { envs }, appRoot)
}

module.exports = {
  login
}