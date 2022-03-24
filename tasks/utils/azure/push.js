
const { docker }  = require('../docker')
const { login:azLogin }  = require('./login')
const { runCmd } = require('@keg-hub/cli-utils')
const { loadEnvs }  = require('../envs/loadEnvs')

/**
 * Example: docker tag ghcr.io/keg-hub/keg-herkin:develop kegregistrycentralus.azurecr.io/keg-hub/keg-herkin:develop
 */
const tagImage = async ({ from, to, env, tag=env }, envs) => {
  const { AZ_CONTAINER_REGISTRY } = envs
  // Tag the docker image to be pushed to google
  return await runCmd(`docker`, [
    `tag`,
    from || `ghcr.io/keg-hub/keg-herkin:fix-run-script`,
    `${AZ_CONTAINER_REGISTRY.toLowerCase()}.azurecr.io/keg-herkin:${tag}`
    
  ], {})
}

/**
 * Example: docker push kegregistrycentralus.azurecr.io/keg-hub/keg-herkin:develop
 */
const pushImage = async ({ env, tag=env }, envs) => {
  const { AZ_CONTAINER_REGISTRY } = envs
  return await runCmd(`docker`, [
    `push`,
    `${AZ_CONTAINER_REGISTRY.toLowerCase()}.azurecr.io/keg-herkin:${tag}`
  ])
}

const azPush = async args => {
  const { params } = args
  const { env } = params
  const envs = loadEnvs({ env })
  await azLogin({ env })
  
  await docker.login([`azure`])
  await docker.context.create([`aci`, `kegcontext`])
  await docker.context.use([`kegcontext`])

  await tagImage(params, envs)
  await pushImage(params, envs)
}

module.exports = {
  azPush
}
