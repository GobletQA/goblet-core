const { get, deepMerge } = require('@keg-hub/jsutils')
const { Logger, runCmd, yarn } = require('@keg-hub/cli-utils')
const { appRoot, bundleDir, containerDir } = require('../../paths')
const { buildBackend } = require('./buildBackend')

const getProjectEnvs = async (envs={}) => {
  const respId = await runCmd(`gcloud`, [
    `config`,
    `list`,
    `--format='value(core.project)'`
  ], { exec: true })
  envs.PROJECT_ID = respId
  
  const respNum = await runCmd(`gcloud`, [
    `projects`,
    `describe`,
    envs.PROJECT_ID,
    `--format='value(projectNumber)'`
  ], { exec: true })
  envs.PROJECT_NUMBER = respNum
  
  return envs
}

const configureGCloud = async () => {
  return await runCmd(`gcloud`, [
  `auth`,
  `configure-docker`,
  `us-west4-docker.pkg.dev`
  ], {})
}

const tagImage = async ({ from, to, env, tag=env }) => {
  // Tag the docker image to be pushed to google
  return await runCmd(`docker`, [
    `tag`,
    from || `ghcr.io/keg-hub/keg-herkin:${env}`,
    `us-west4-docker.pkg.dev/herkin-dev/keg-herkin:${tag}`
  ], {})
}

const pushImage = async ({ env, tag=env }) => {
  return await runCmd(`docker`, [
    `push`,
    `us-west4-docker.pkg.dev/herkin-dev/keg-herkin:${tag}`
  ])
}

const deployBackend = async args => {
  const { params } = args
  const { build } = params

  build && await buildBackend(args, `backend`)
  // const envs = await getProjectEnvs()'
  await configureGCloud(param)
  await tagImage(params)
  await pushImage(params)
  
}

module.exports = {
  deployBackend
}